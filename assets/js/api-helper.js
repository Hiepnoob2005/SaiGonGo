/**
 * SaiGonGo - API Helper for Multilingual Support
 * File này chứa các hàm tiện ích để gọi API server với hỗ trợ đa ngôn ngữ
 *
 * CÁCH SỬ DỤNG:
 * 1. Thêm <script src="assets/js/api-helper.js"></script> vào HTML
 * 2. Đảm bảo i18n.js đã được load trước
 * 3. Sử dụng các hàm: ServerAPI.getDirections(), ServerAPI.verifyImage(), ServerAPI.verifyDetail()
 */

const ServerAPI = {
    /**
     * Lấy ngôn ngữ hiện tại từ i18n
     * @returns {string} Mã ngôn ngữ ('vi' hoặc 'en')
     */
    getCurrentLanguage: function() {
        if (typeof i18n !== 'undefined' && i18n.getCurrentLanguage) {
            return i18n.getCurrentLanguage();
        }
        return localStorage.getItem('saigongo_language') || 'vi';
    },

    /**
     * Yêu cầu lộ trình từ server (gọi API /get-dynamic-directions)
     * @param {string} start - Mã điểm bắt đầu (ví dụ: 'bao_tang_chien_tich')
     * @param {string} end - Mã điểm kết thúc
     * @param {boolean} alternative - Có phải lộ trình thay thế không
     * @returns {Promise} Promise chứa kết quả từ server
     *
     * VÍ DỤ:
     * const result = await ServerAPI.getDirections('bao_tang_chien_tich', 'dinh_doc_lap', false);
     * console.log(result.route_text); // Chỉ dẫn đường đi bằng ngôn ngữ hiện tại
     */
    getDirections: async function(start, end, alternative = false) {
        const lang = this.getCurrentLanguage();

        try {
            const response = await fetch('/get-dynamic-directions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    start: start,
                    end: end,
                    alternative: alternative,
                    lang: lang  // Gửi ngôn ngữ hiện tại lên server
                })
            });

            return await response.json();
        } catch (error) {
            console.error('❌ Lỗi khi gọi API get-directions:', error);
            throw error;
        }
    },

    /**
     * Xác thực hình ảnh địa điểm (gọi API /verify-image)
     * @param {File} imageFile - File ảnh cần xác thực
     * @param {string} locationName - Tên địa điểm
     * @returns {Promise} Promise chứa kết quả xác thực
     *
     * VÍ DỤ:
     * const file = document.getElementById('fileInput').files[0];
     * const result = await ServerAPI.verifyImage(file, 'Bảo tàng Chiến tích Chiến tranh');
     * console.log(result.message); // "Đúng địa điểm" hoặc "Correct location"
     */
    verifyImage: async function(imageFile, locationName) {
        const lang = this.getCurrentLanguage();

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('location', locationName);
        formData.append('lang', lang);  // Gửi ngôn ngữ hiện tại

        try {
            const response = await fetch('/verify-image', {
                method: 'POST',
                body: formData
            });

            return await response.json();
        } catch (error) {
            console.error('❌ Lỗi khi gọi API verify-image:', error);
            throw error;
        }
    },

    /**
     * Xác thực chi tiết/hiện vật trong quiz (gọi API /api/verify-detail)
     * @param {File} imageFile - File ảnh hiện vật
     * @param {string} detailId - ID của hiện vật (ví dụ: 'uh1', 'm48')
     * @param {boolean} reportMissing - Có báo cáo vật thể bị thiếu không
     * @returns {Promise} Promise chứa kết quả xác thực
     *
     * VÍ DỤ:
     * const file = document.getElementById('cameraInput').files[0];
     * const result = await ServerAPI.verifyDetail(file, 'uh1', false);
     * if (result.success && result.data.valid) {
     *     console.log(result.data.fact); // Thông tin thú vị về vật thể
     * }
     */
    verifyDetail: async function(imageFile, detailId, reportMissing = false) {
        const lang = this.getCurrentLanguage();

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('detail_id', detailId);
        formData.append('report_missing', reportMissing.toString());
        formData.append('lang', lang);  // Gửi ngôn ngữ hiện tại

        try {
            const response = await fetch('/api/verify-detail', {
                method: 'POST',
                body: formData
            });

            return await response.json();
        } catch (error) {
            console.error('❌ Lỗi khi gọi API verify-detail:', error);
            throw error;
        }
    }
};

// Export để sử dụng trong các module khác (nếu cần)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServerAPI;
}
