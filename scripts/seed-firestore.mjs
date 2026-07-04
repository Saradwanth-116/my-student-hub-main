/**
 * Firestore Seed Script
 * ---------------------
 * Run this ONCE after setting up your Firebase project to populate Firestore
 * with sample student data (same data that was previously hardcoded in mockData.ts).
 *
 * Prerequisites:
 *   1. Create a Firebase project at https://console.firebase.google.com
 *   2. Enable Authentication → Email/Password
 *   3. Enable Cloud Firestore (start in test mode)
 *   4. Go to Project Settings → Service Accounts → Generate New Private Key
 *   5. Save the JSON key file as `serviceAccountKey.json` in THIS folder (scripts/)
 *
 * Usage:
 *   cd my-student-hub-main
 *   npm install firebase-admin    (one-time)
 *   node scripts/seed-firestore.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
    readFileSync(join(__dirname, "serviceAccountKey.json"), "utf8")
);

initializeApp({ credential: cert(serviceAccount) });

const authAdmin = getAuth();
const db = getFirestore();

// ─── Config ────────────────────────────────────────
const TEST_EMAIL = "arjun.sharma@university.edu";
const TEST_PASSWORD = "password123";

const studentProfile = {
    name: "Arjun Sharma",
    rollNo: "21CS1045",
    department: "Computer Science",
    semester: 6,
    year: 3,
    email: "arjun.sharma@university.edu",
};

const attendanceData = [
    { subject: "Data Structures", code: "CS301", attended: 38, total: 42, percentage: 90 },
    { subject: "Operating Systems", code: "CS302", attended: 35, total: 40, percentage: 88 },
    { subject: "Database Systems", code: "CS303", attended: 30, total: 42, percentage: 71 },
    { subject: "Computer Networks", code: "CS304", attended: 40, total: 42, percentage: 95 },
    { subject: "Software Engineering", code: "CS305", attended: 28, total: 40, percentage: 70 },
    { subject: "Discrete Mathematics", code: "MA301", attended: 36, total: 42, percentage: 86 },
];

const marksData = {
    "Year 1": [
        { subject: "Engineering Mathematics I", code: "MA101", mid1: 22, mid1Total: 30, mid2: 25, mid2Total: 30, semester: 72, semesterTotal: 100, grade: "A" },
        { subject: "Engineering Physics", code: "PH101", mid1: 18, mid1Total: 30, mid2: 20, mid2Total: 30, semester: 65, semesterTotal: 100, grade: "B+" },
        { subject: "Programming in C", code: "CS101", mid1: 28, mid1Total: 30, mid2: 27, mid2Total: 30, semester: 88, semesterTotal: 100, grade: "A+" },
        { subject: "Engineering Chemistry", code: "CH101", mid1: 20, mid1Total: 30, mid2: 22, mid2Total: 30, semester: 70, semesterTotal: 100, grade: "A" },
        { subject: "English Communication", code: "EN101", mid1: 24, mid1Total: 30, mid2: 26, mid2Total: 30, semester: 78, semesterTotal: 100, grade: "A" },
    ],
    "Year 2": [
        { subject: "Data Structures", code: "CS201", mid1: 26, mid1Total: 30, mid2: 24, mid2Total: 30, semester: 82, semesterTotal: 100, grade: "A" },
        { subject: "Digital Logic Design", code: "CS202", mid1: 20, mid1Total: 30, mid2: 23, mid2Total: 30, semester: 68, semesterTotal: 100, grade: "B+" },
        { subject: "Object Oriented Programming", code: "CS203", mid1: 27, mid1Total: 30, mid2: 28, mid2Total: 30, semester: 90, semesterTotal: 100, grade: "A+" },
        { subject: "Probability & Statistics", code: "MA201", mid1: 19, mid1Total: 30, mid2: 21, mid2Total: 30, semester: 64, semesterTotal: 100, grade: "B+" },
        { subject: "Computer Architecture", code: "CS204", mid1: 23, mid1Total: 30, mid2: 25, mid2Total: 30, semester: 75, semesterTotal: 100, grade: "A" },
    ],
    "Year 3": [
        { subject: "Operating Systems", code: "CS301", mid1: 25, mid1Total: 30, mid2: 24, mid2Total: 30, semester: 78, semesterTotal: 100, grade: "A" },
        { subject: "Database Systems", code: "CS302", mid1: 22, mid1Total: 30, mid2: 26, mid2Total: 30, semester: 74, semesterTotal: 100, grade: "A" },
        { subject: "Computer Networks", code: "CS303", mid1: 28, mid1Total: 30, mid2: 27, mid2Total: 30, semester: 85, semesterTotal: 100, grade: "A+" },
        { subject: "Software Engineering", code: "CS304", mid1: 21, mid1Total: 30, mid2: 23, mid2Total: 30, semester: 70, semesterTotal: 100, grade: "B+" },
        { subject: "Discrete Mathematics", code: "MA301", mid1: 24, mid1Total: 30, mid2: 22, mid2Total: 30, semester: 72, semesterTotal: 100, grade: "A" },
    ],
};

// ─── Seed ──────────────────────────────────────────
async function seed() {
    console.log("🔑 Creating test user...");

    let uid;
    try {
        const existing = await authAdmin.getUserByEmail(TEST_EMAIL);
        uid = existing.uid;
        console.log(`   User already exists: ${uid}`);
    } catch {
        const newUser = await authAdmin.createUser({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            displayName: studentProfile.name,
        });
        uid = newUser.uid;
        console.log(`   Created user: ${uid}`);
    }

    console.log("📄 Writing student profile...");
    await db.collection("students").doc(uid).set(studentProfile);

    console.log("📊 Writing attendance data...");
    const attendanceBatch = db.batch();
    for (const a of attendanceData) {
        const ref = db.collection("students").doc(uid).collection("attendance").doc(a.code);
        attendanceBatch.set(ref, a);
    }
    await attendanceBatch.commit();

    console.log("📝 Writing marks data...");
    const marksBatch = db.batch();
    for (const [yearLabel, subjects] of Object.entries(marksData)) {
        for (const m of subjects) {
            const ref = db.collection("students").doc(uid).collection("marks").doc(m.code);
            marksBatch.set(ref, { ...m, yearLabel });
        }
    }
    await marksBatch.commit();

    console.log("\n✅ Seed complete!");
    console.log(`\n   Login with:  ${TEST_EMAIL}  /  ${TEST_PASSWORD}`);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
