import axios from "axios";

/**
 * TODO: MOVE NOVEMBERIZING/JS 
 */
const novemberizing = {
    http: {
        get: async o => {
            const response = await axios.get(o);
            return response.data;
        }
    },
    array: {
        front: o => o[0]
    }
};

export default novemberizing;
