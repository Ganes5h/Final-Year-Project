import * as SecureStore from 'expo-secure-store';

const StorageUtil = {
    /**
     * Encrypt and store user data securely.
     * @param {string} key - Key to identify the stored data.
     * @param {Object} userData - The user object to encrypt and store.
     * @returns {Promise<void>}
     */
    async encryptAndStore(key, userData) {
        try {
            const jsonData = JSON.stringify(userData); // Convert object to JSON string
            await SecureStore.setItemAsync(key, jsonData); // Store securely
            console.log('Data securely encrypted and stored!');
        } catch (error) {
            console.error('Error encrypting and storing data:', error);
            throw error;
        }
    },

    /**
     * Retrieve and decrypt user data securely.
     * @param {string} key - Key to identify the stored data.
     * @returns {Promise<Object|null>} - The decrypted user object or null if not found.
     */
    async retrieveAndDecrypt(key) {
        try {
            const jsonData = await SecureStore.getItemAsync(key); // Retrieve securely
            if (jsonData) {
                return typeof jsonData === "string"
                    ? JSON.parse(jsonData)
                    : jsonData;
            }
            console.log('No data found for the given key.');
            return null;
        } catch (error) {
            console.error('Error retrieving or decrypting data:', error);
            throw error;
        }
    },

    /**
     * Remove stored data securely.
     * @param {string} key - Key to identify the stored data.
     * @returns {Promise<void>}
     */
    async removeData(key) {
        try {
            await SecureStore.deleteItemAsync(key); // Remove securely
            console.log('Data successfully removed!');
        } catch (error) {
            console.error('Error removing data:', error);
            throw error;
        }
    },
};

export default StorageUtil;
