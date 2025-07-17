import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,        // 1 virtual user for smoke test
    iterations: 1, // 1 iteration for quick health check
};

export default function () {
    const url = 'http://localhost:8081/api/bookings';

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInVzZXJfaWQiOjUsImZpcnN0X25hbWUiOiJKYW1lcyIsImxhc3RfbmFtZSI6Ik11Z28iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NTI3NDAzODksImlhdCI6MTc1MjY1Mzk4OX0.IFEwWw5QPQtnY58nThbyXYJb2eTM4DCeeHr6fVTmYpw`
        },
    };

    const res = http.get(url, params);

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