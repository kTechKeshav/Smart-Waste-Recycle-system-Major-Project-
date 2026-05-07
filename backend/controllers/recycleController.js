import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const processRecycleItems = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        const labels = new Set();
        const detectedItems = []; // To store details per image if needed

        // 1. Process each image with Service 1 (Classification)
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file.buffer, { filename: file.originalname });

            try {
                const classificationUrl = process.env.CLASSIFICATION_SERVICE_URL || 'http://127.0.0.1:8000';
                const response = await axios.post(`${classificationUrl}/predict`, formData, {
                    headers: { ...formData.getHeaders() },
                });

                if (response.data && response.data.prediction) {
                    const label = response.data.prediction.label;
                    labels.add(label);
                    detectedItems.push({
                        filename: file.originalname,
                        label: label,
                        confidence: response.data.prediction.confidence
                    });
                }
            } catch (error) {
                console.error(`Error connecting to Classification Service (8000) for file ${file.originalname}:`, error.message);
                if (error.code === 'ECONNREFUSED') {
                     return res.status(502).json({ 
                        success: false, 
                        message: "Classification Service (Port 8000) is not running or unreachable." 
                    });
                }
                // Continue with other files if it's just a processing error, unless all fail
            }
        }

        if (labels.size === 0) {
             return res.status(500).json({ success: false, message: "Could not classify items. Ensure Service 1 is running and images are valid." });
        }

        const uniqueLabels = Array.from(labels);

        // 2. Get Recommendations from Service 2
        let recommendations = null;
        try {
            const recommendationUrl = process.env.RECOMMENDATION_SERVICE_URL || 'https://smart-waste-recycle-system-major-project-1rlk.onrender.com';
            const recResponse = await axios.post(`${recommendationUrl}/api/reuse-guides`, {
                waste_items: uniqueLabels
            });
            recommendations = recResponse.data;
        } catch (error) {
             if (error.code === 'ECONNREFUSED') {
                return res.status(502).json({ 
                    success: false, 
                    message: "Recommendation Service (Port 5000) is not running or unreachable." 
                });
             }
             return res.status(502).json({ success: false, message: "Recommendation service failed." });
        }

        // 3. Get Waste Info for each label (Endpoint 2)
        const wasteInfoResults = {};
        for (const label of uniqueLabels) {
            try {
                const recommendationUrl = process.env.RECOMMENDATION_SERVICE_URL || 'http://127.0.0.1:5000';
                const infoResponse = await axios.post(`${recommendationUrl}/api/waste-info`, {
                    material: label
                });
                wasteInfoResults[label] = infoResponse.data;
            } catch (error) {
                console.error(`Error getting waste info for ${label}:`, error.message);
                // Don't fail the whole request if just one info lookup fails, but log it.
                wasteInfoResults[label] = { error: "Could not fetch details." };
            }
        }

        // 3. Return combined response
        return res.json({
            success: true,
            detected_items: detectedItems,
            unique_labels: uniqueLabels,
            recommendations: recommendations,
            waste_info: wasteInfoResults
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { processRecycleItems };
