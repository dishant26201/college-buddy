function markChances(highSchoolGrade, acceptanceRate, avgGradeReq) {
    const difference = highSchoolGrade - avgGradeReq;
    const score = difference / 10 + acceptanceRate / 10;

    if (score >= 7) {
        return "Safety";
    } else if (score >= 4) {
        return "Target";
    } else {
        return "Reach";
    }
}

export function colorChances(highSchoolGrade, acceptanceRate, avgGradeReq) {
    const difference = highSchoolGrade - avgGradeReq;
    const score = difference / 10 + acceptanceRate / 10;

    if (score >= 7) {
        return "#1a75ff";
    } else if (score >= 4) {
        return "#33cc33";
    } else {
        return "#f44336";
    }
}

export default markChances;