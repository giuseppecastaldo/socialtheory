import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
require('dayjs/locale/it')

dayjs.locale("it");
dayjs.extend(relativeTime)

export default dayjs;