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
        front: o => o[0],
        map: (o, func) => {
            o = Array.isArray(o) ? o : novemberizing.as.array(o);

            return o ? o.map(func) : o;
        }
    },
    dom: {
        text: o => o.textContent,
        get: (element, tag, index = 0) => {
            const elements = element.getElementsByTagName(tag);
            return elements[index];
        }
    },
    as: {
        array: o => {
            if(Array.isArray(o)) return o;
            if(o !== null && o !== undefined) {
                return [o];
            }
        }
    }
};

export default novemberizing;
