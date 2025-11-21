# MongoDB Compass Setup Guide for Co-Campus

## Step 1: Create Database

1. Open **MongoDB Compass**
2. Connect to your local MongoDB instance (usually `mongodb://localhost:27017`)
3. Click on **"CREATE DATABASE"** button
4. Enter Database Name: `cocampus`
5. Enter First Collection Name: `users`
6. Click **"CREATE DATABASE"**

---

## Step 2: Create All Collections

After creating the database, create the following collections one by one:

### Click on "CREATE COLLECTION" button in the cocampus database and create these:

#### **User & Authentication Collections:**
1. `users` (already created)
2. `sessions`
3. `otp_verifications`

#### **Academic Collections:**
4. `departments`
5. `subjects`
6. `semesters`
7. `timetables`
8. `assignments`
9. `assignment_submissions`
10. `attendance`
11. `attendance_records`
12. `marks`
13. `results`
14. `academic_calendar`

#### **Approval & Request Collections:**
15. `gate_pass_requests`
16. `leave_requests`
17. `event_requests`
18. `attendance_exemption_requests`
19. `certificate_requests`

#### **Club & Events Collections:**
20. `clubs`
21. `club_members`
22. `events`
23. `event_participants`
24. `club_departments`

#### **Hostel Collections:**
25. `hostel_blocks`
26. `hostel_rooms`
27. `hostel_allocations`
28. `mess_menu`

#### **Canteen & Food Service Collections:**
29. `canteen_stalls`
30. `menu_items`
31. `orders`
32. `order_items`

#### **Financial Collections:**
33. `campus_coins_wallets`
34. `transactions`
35. `fee_structure`
36. `fee_payments`
37. `receipts`

#### **Sports Collections:**
38. `sports_facilities`
39. `facility_bookings`

#### **Communication Collections:**
40. `notices`
41. `notifications`
42. `feedback`
43. `achievements`

#### **Resources Collections:**
44. `laboratories`
45. `equipment`
46. `budget_allocations`

---

## Step 3: Create Indexes for Performance

For each collection, click on the collection → **"Indexes"** tab → **"CREATE INDEX"**

### Critical Indexes to Create:

**users collection:**
```json
{ "email": 1 } - Unique
{ "userId": 1 } - Unique
{ "role": 1 }
{ "department": 1 }
```

**assignments collection:**
```json
{ "facultyId": 1 }
{ "subject": 1 }
{ "dueDate": 1 }
{ "status": 1 }
```

**attendance collection:**
```json
{ "studentId": 1 } - Unique
{ "semester": 1 }
```

**gate_pass_requests collection:**
```json
{ "studentId": 1 }
{ "status": 1 }
{ "requestDate": -1 }
```

**transactions collection:**
```json
{ "userId": 1 }
{ "date": -1 }
{ "type": 1 }
```

**orders collection:**
```json
{ "studentId": 1 }
{ "stallId": 1 }
{ "status": 1 }
{ "orderDate": -1 }
```

---

## Step 4: Validation Rules (Optional but Recommended)

For critical collections, add validation rules:

### Example: users collection validation

1. Click on **users** collection
2. Go to **"Validation"** tab
3. Click **"ADD VALIDATION"**
4. Select **"JSON Schema"**
5. Paste this schema:

```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["email", "userId", "name", "role"],
    "properties": {
      "email": {
        "bsonType": "string",
        "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      },
      "userId": {
        "bsonType": "string"
      },
      "name": {
        "bsonType": "string",
        "minLength": 2
      },
      "role": {
        "enum": ["student", "faculty", "hod", "principal", "admin", "warden", "canteen", "stall", "sports", "club"]
      },
      "status": {
        "enum": ["active", "inactive", "suspended"]
      }
    }
  }
}
```

---

## Step 5: Initial Admin User Creation

1. Click on **users** collection
2. Click **"ADD DATA"** → **"Insert Document"**
3. Paste this document:

```json
{
  "userId": "ADMIN001",
  "email": "admin@cocampus.edu",
  "name": "System Administrator",
  "phone": "+91 9999999999",
  "role": "admin",
  "department": "Administration",
  "password": "$2b$10$rKqNFxGqYvZ8p8K0QxK0QeU0xN7xK0QxK0QxK0QxK0QxK0QxK0Q",
  "status": "active",
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "lastLogin": null,
  "profile": {
    "avatar": "https://ui-avatars.com/api/?name=System+Administrator&background=4f46e5&color=fff"
  }
}
```

**Note:** This password hash is for "Admin@123" - you should change it after first login.

---

## Step 6: Verify Connection String

Your MongoDB connection string should be:
```
mongodb://localhost:27017/cocampus
```

Or if you have authentication enabled:
```
mongodb://username:password@localhost:27017/cocampus
```

---

## Step 7: Database Ready!

✅ Database created: `cocampus`
✅ All 45+ collections created
✅ Indexes added for performance
✅ Validation rules set
✅ Initial admin user created

Your MongoDB is now ready for the Co-Campus backend!

---

## Additional Tips for MongoDB Compass:

### To View Collection Stats:
- Click on any collection
- Go to **"Indexes"** tab to see index usage
- Check **"Schema"** tab to see data structure

### To Import Sample Data:
- Click on collection
- Click **"ADD DATA"** → **"Import File"**
- Select JSON or CSV file

### To Export Data:
- Click on collection
- Click **"Export Collection"**
- Choose format (JSON or CSV)

### To Create Backup:
- Use MongoDB Compass's export feature for each collection
- Or use mongodump command in terminal:
  ```
  mongodump --db cocampus --out ./backup
  ```

---

## Connection Details for Backend:

When setting up the Node.js backend, use these details:

```env
MONGODB_URI=mongodb://localhost:27017/cocampus
DB_NAME=cocampus
```

---

**Ready to proceed with backend setup!** 🚀
