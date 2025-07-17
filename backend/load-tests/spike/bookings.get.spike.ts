import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081'; // Update if your API runs on a different port

export const options = {
    stages: [
        { duration: '10s', target: 10 },   // ramp-up to 10 users
        { duration: '10s', target: 200 },  // sudden spike to 200 users
        { duration: '20s', target: 300 },  // stay at 300 users
        { duration: '10s', target: 10 },   // quick ramp-down to 10 users
        { duration: '10s', target: 0 },    // ramp-down to 0 users
    ],
    ext: {
        loadimpact: {
            name: 'Bookings GET Spike Test',
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