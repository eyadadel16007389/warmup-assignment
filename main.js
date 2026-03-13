const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    // TODO: Implement this function
function p(t) {
    const lower = t.toLowerCase().trim();
    let [time, per] = lower.split(" ");
    if (!per) per = "";
    const [h, m, s] = time.split(":").map(n => Number(n) || 0);
    let hour = h;
    if (per === "pm" && hour !== 12) hour += 12;
    if (per === "am" && hour === 12) hour = 0;
    return hour * 3600 + m * 60 + s;
    }
    let diff = p(endTime) - p(startTime);
    if (diff < 0) diff += 86400;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    // TODO: Implement this function
function p(t) {
const lower = t.toLowerCase().trim();
let [time, per] = lower.split(" ");
if (!per) per = "";
const [h, m, s] = time.split(":").map(n => Number(n) || 0);
let hour = h;
if (per === "pm" && hour !== 12) hour += 12;
    if (per === "am" && hour === 12) hour = 0;
        return hour * 3600 + m * 60 + s;
         }
let s = p(startTime);
let e = p(endTime);
if (e < s) e += 86400;
const ds = 8 * 3600;
const de = 22 * 3600;
let idle = 0;
if (s < ds) idle += Math.min(e, ds) - s;
if (e > de) idle += e - Math.max(s, de);
const h = Math.floor(idle / 3600);
const m = Math.floor((idle % 3600) / 60);
const sec = idle % 60;
return h + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}


// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    // TODO: Implement this function
function d2s(d) {
    const p = d.split(":").map(n => Number(n) || 0);
    return p[0] * 3600 + p[1] * 60 + p[2];
        }
let sec = d2s(shiftDuration) - d2s(idleTime);
 if (sec < 0) sec = 0;
const h = Math.floor(sec / 3600);
 const m = Math.floor((sec % 3600) / 60);
const s = sec % 60;
 return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
function d2s(d) {
    const p = d.split(":").map(n => Number(n) || 0);
    return p[0] * 3600 + p[1] * 60 + p[2];
        }
const sec = d2s(activeTime);
let quota = 8 * 3600 + 24 * 60;
if (date >= "2025-04-10" && date <= "2025-04-30") quota = 6 * 3600;
    return sec >= quota;
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
let content = fs.readFileSync(textFile, "utf8").trim();
let lines = content ? content.split("\n") : [];
    for (let line of lines) {
        let cols = line.split(",");
        if (cols[0] === shiftObj.driverID && cols[2] === shiftObj.date) return {};
            }
const sd = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
const it = getIdleTime(shiftObj.startTime, shiftObj.endTime);
const at = getActiveTime(sd, it);
const mq = metQuota(shiftObj.date, at);
const newRow = [
    shiftObj.driverID,
    shiftObj.driverName,
    shiftObj.date,
    shiftObj.startTime,
    shiftObj.endTime,
    sd,
    it,
    at,
    mq ? "true" : "false",
    "false"
    ].join(",");

let last = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].split(",")[0] === shiftObj.driverID) last = i;
    }
        if (last === -1) lines.push(newRow);
    else lines.splice(last + 1, 0, newRow);

fs.writeFileSync(textFile, lines.join("\n") + "\n");
        return {
            driverID: shiftObj.driverID,
            driverName: shiftObj.driverName,
            date: shiftObj.date,
            startTime: shiftObj.startTime,
            endTime: shiftObj.endTime,
            shiftDuration: sd,
            idleTime: it,
            activeTime: at,
            metQuota: mq,
            hasBonus: false
        };
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
let content = fs.readFileSync(textFile, "utf8").trim();
    let lines = content ? content.split("\n") : [];
    for (let i = 0; i < lines.length; i++) {
        let cols = lines[i].split(",");
        if (cols[0] === driverID && cols[2] === date) {
            cols[9] = newValue ? "true" : "false";
            lines[i] = cols.join(",");
            break;
             }
        }
    fs.writeFileSync(textFile, lines.join("\n") + "\n");
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
let content = fs.readFileSync(textFile, "utf8");
let lines = content.split("\n");
let found = false;
let count = 0;
let mStr = String(month).padStart(2, "0");
    for (let line of lines) {
        let l = line.trim();
        if (!l) continue;
        let cols = l.split(",");
        if (cols[0] === driverID) {
            found = true;
            if (cols[2].split("-")[1] === mStr && cols[9] === "true") count++;
            }
        }
    return found ? count : -1;
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
let content = fs.readFileSync(textFile, "utf8");
let lines = content.split("\n");
let total = 0;
let mStr = String(month).padStart(2, "0");
    function d2s(d) {
        let p = d.split(":").map(n => Number(n) || 0);
        return p[0] * 3600 + p[1] * 60 + p[2];
    }
for (let line of lines) {
    let l = line.trim();
        if (!l) continue;
            let cols = l.split(",");
        if (cols[0] === driverID && cols[2].split("-")[1] === mStr) {
            total += d2s(cols[7]);
        }
    }
let h = Math.floor(total / 3600);
let m = Math.floor((total % 3600) / 60);
let s = total % 60;
    return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
let rateContent = fs.readFileSync(rateFile, "utf8");
let dayOff = "";
    for (let line of rateContent.split("\n")) {
        let l = line.trim();
        if (!l) continue;
        let cols = l.split(",");
        if (cols[0] === driverID) {
            dayOff = cols[1];
            break;
        }
    }
const days = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
let dayNum = days[dayOff] !== undefined ? days[dayOff] : -1;
let shiftContent = fs.readFileSync(textFile, "utf8");
let total = 0;
let mStr = String(month).padStart(2, "0");
    function d2s(d) {
        let p = d.split(":").map(n => Number(n) || 0);
        return p[0] * 3600 + p[1] * 60 + p[2];
    }
    function getDOW(dStr) {
        let parts = dStr.split("-").map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]).getDay();
    }
for (let line of shiftContent.split("\n")) {
    let l = line.trim();
        if (!l || l.startsWith("driverID")) continue;
            let cols = l.split(",");
        if (cols[0] === driverID) {
            let rowDate = cols[2];
        if (rowDate.split("-")[1] === mStr) {
            let dow = getDOW(rowDate);
        if (dow !== dayNum) {
            let eid = (rowDate >= "2025-04-10" && rowDate <= "2025-04-30");
            let q = eid ? 6 * 3600 : 8 * 3600 + 24 * 60;
                    total += q;
                }
                }
            }
    }
total -= bonusCount * 2 * 3600;
if (total < 0) total = 0;

let h = Math.floor(total / 3600);
let m = Math.floor((total % 3600) / 60);
let s = total % 60;
    return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
let content = fs.readFileSync(rateFile, "utf8");
let base = 0;
let tier = 0;
    for (let line of content.split("\n")) {
        let l = line.trim();
        if (!l) continue;
        let cols = l.split(",");
        if (cols[0] === driverID) {
            base = Number(cols[2]);
            tier = Number(cols[3]);
            break;
        }
    }
let allowed = [0, 50, 20, 10, 3][tier] || 0;
     function d2s(d) {
        let p = d.split(":").map(n => Number(n) || 0);
        return p[0] * 3600 + p[1] * 60 + p[2];
    }
let miss = Math.max(0, d2s(requiredHours) - d2s(actualHours));
let billableSec = Math.max(0, miss - allowed * 3600);
let billableH = Math.floor(billableSec / 3600);
    let rate = Math.floor(base / 185);
    return base - billableH * rate;
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
