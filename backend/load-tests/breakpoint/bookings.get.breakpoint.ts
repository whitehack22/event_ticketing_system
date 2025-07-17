import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081'; // Update if your API runs on a different port

export const options = {
    stages: [
        { duration: '30s', target: 50 },    // ramp-up to 50 users
        { duration: '30s', target: 100 },   // ramp-up to 100 users
        { duration: '30s', target: 200 },   // ramp-up to 200 users
        { duration: '30s', target: 400 },   // ramp-up to 400 users
        { duration: '30s', target: 800 },   // ramp-up to 800 users
        { duration: '30s', target: 1600 },  // ramp-up to 1600 users (keep increasing)
        { duration: '30s', target: 0 },     // ramp-down to 0 users
    ],
    ext: {
        loadimpact: {
            name: 'Bookings GET Breakpoint Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/api/bookings`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInVzZXJfaWQiOjUsImZpcnN0X25hbWUiOiJKYW1lcyIsImxhc3RfbmFtZSI6Ik11Z28iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NTI4MjIzMTMsImlhdCI6MTc1MjczNTkxM30.9N5J2-l5L6vsRS5rS415x_bFQEwcWv5bELey2W9FHt8`,
        },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}