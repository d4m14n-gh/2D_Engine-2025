export class GMath {
    static symRand(value) {
        return (2 * Math.random() - 1) * value;
    }
    static getColliderRadius(n, radius) {
        if (n >= 10)
            return radius;
        const angle = Math.PI / n;
        const h = Math.cos(angle) * radius;
        return (2 * h + radius) / 3;
    }
    static deltaAngle(a, b) {
        a = a % (2 * Math.PI) + 2 * Math.PI;
        a = a % (2 * Math.PI);
        b = b % (2 * Math.PI) + 2 * Math.PI;
        b = b % (2 * Math.PI) + 2 * Math.PI;
        return (b - a + Math.PI) % (2 * Math.PI) - Math.PI;
    }
    static elasticCollision1D(m1, v1, m2, v2) {
        const v1Final = ((v1 * (m1 - m2)) + (2 * m2 * v2)) / (m1 + m2);
        const v2Final = ((v2 * (m2 - m1)) + (2 * m1 * v1)) / (m1 + m2);
        return [v1Final, v2Final];
    }
}
