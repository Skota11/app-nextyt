export default function nicoCheck(params: string) {
    const niconicoIdReg = /(?:sm|nm|so|ca|ax|yo|nl|ig|na|cw|z[a-e]|om|sk|yk)\d{1,14}\b/;
    return niconicoIdReg.test(params)
}