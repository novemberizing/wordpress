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
    },
    dom: {
        text: o => o.textContent,
        get: (element, tag, index = 0) => {
            const elements = element.getElementsByTagName(tag);
            return elements[index];
        }
    }
};

export default novemberizing;
