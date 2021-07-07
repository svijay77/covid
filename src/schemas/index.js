// code generated by pbf v3.2.1

// Dot ========================================

export var Dot = {};

Dot.read = function (pbf, end) {
    return pbf.readFields(Dot._readField, {val: []}, end);
};
Dot._readField = function (tag, obj, pbf) {
    if (tag === 1) pbf.readPackedVarint(obj.val, true);
};
Dot.write = function (obj, pbf) {
    if (obj.val) pbf.writePackedVarint(1, obj.val);
};

// Entry ========================================

export var Entry = {};

Entry.read = function (pbf, end) {
    return pbf.readFields(Entry._readField, {geoid: 0, vals: []}, end);
};
Entry._readField = function (tag, obj, pbf) {
    if (tag === 1) obj.geoid = pbf.readVarint(true);
    else if (tag === 2) pbf.readPackedVarint(obj.vals, true);
};
Entry.write = function (obj, pbf) {
    if (obj.geoid) pbf.writeVarintField(1, obj.geoid);
    if (obj.vals) pbf.writePackedVarint(2, obj.vals);
};

// Rows ========================================

export var Rows = {};

Rows.read = function (pbf, end) {
    return pbf.readFields(Rows._readField, {dates: [], row: []}, end);
};
Rows._readField = function (tag, obj, pbf) {
    if (tag === 1) obj.dates.push(pbf.readString());
    else if (tag === 2) obj.row.push(Entry.read(pbf, pbf.readVarint() + pbf.pos));
};
Rows.write = function (obj, pbf) {
    if (obj.dates) for (var i = 0; i < obj.dates.length; i++) pbf.writeStringField(1, obj.dates[i]);
    if (obj.row) for (i = 0; i < obj.row.length; i++) pbf.writeMessage(2, Entry.write, obj.row[i]);
};
