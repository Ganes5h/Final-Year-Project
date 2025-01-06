import StorageUtil from "./StorageUtil";

const fetchUserId = async () => {
    try {
        const storedUserData = await StorageUtil.retrieveAndDecrypt('user');
        console.log('Raw Stored User Data:', storedUserData);
        console.log('Type of Stored User Data:', typeof storedUserData);

        // Handle if storedUserData is already parsed
        if (storedUserData && typeof storedUserData === 'object' && storedUserData._id) {
            return storedUserData._id;
        }

        // Handle string case
        if (typeof storedUserData === 'string') {
            try {
                const parsedData = JSON.parse(storedUserData);
                return parsedData._id;
            } catch (parseError) {
                console.error('JSON Parsing Error:', parseError);

                // Check for specific prefix 'u' and try alternative parsing
                if (storedUserData.startsWith('u')) {
                    console.log('Detected prefix "u", attempting cleanup');
                    const cleanedData = storedUserData.slice(1);
                    try {
                        const alternativeParsedData = JSON.parse(cleanedData);
                        return alternativeParsedData._id;
                    } catch (altParseError) {
                        console.error('Alternative parsing failed:', altParseError);
                    }
                }
            }
        }

        // Fallback if all attempts fail
        console.warn('Unable to fetch user ID. Returning null.');
        return null;
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return null;
    }
};

export default fetchUserId;
