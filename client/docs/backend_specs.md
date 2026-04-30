# 🛠️ Final Backend Integration Specifications

This document contains the definitive requirements for the backend developer to support the production-ready AI Budget Tracker.

---

## 1. User Model Updates
The `User` model must be extended to store financial configuration and onboarding status.

**Target File**: `server/models/User.js`

### New Fields:
```javascript
{
  // Existing: name, email, password, etc.
  
  monthlyBudget: {
    type: Number,
    default: 0
  },
  fixedExpenses: [
    {
      label: { type: String, required: true },
      amount: { type: Number, required: true },
      dueDate: { type: Number, default: 1 }, // Day of month (1-31) for Reminders
    }
  ],
  onboardingCompleted: {
    type: Boolean,
    default: false
  }
}
```

---

## 2. Savings Goals Model
Create a new collection for tracking user savings milestones.

**New File**: `server/models/Goal.js`

### Schema Definition:
```javascript
const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  emoji: { type: String, default: '🎯' },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 3. Required API Endpoints

### A. User Profile (`/api/user`)
*   **PUT `/profile`**
    *   **Description**: Updates user's personal info and financial baseline.
    *   **Payload**: `{ name, monthlyBudget, fixedExpenses, onboardingCompleted }`
    *   **Response**: Returns the updated `user` object.
    *   **Rationale**: Powers both the **Onboarding Wizard** and the **Profile Settings** page.

### B. Savings Goals (`/api/goals`)
*   **GET `/`**: Return all goals for `req.user.id`.
*   **POST `/`**: Create a new goal.
*   **PATCH `/:id`**: Update goal (name, target, or especially `savedAmount`).
*   **DELETE `/:id`**: Remove a goal.

---

## 4. Frontend Integration Checklist
To ensure the frontend works perfectly, please verify the following:
1.  **Auth Response**: The `login` and `register` endpoints should now include the `monthlyBudget`, `fixedExpenses`, and `onboardingCompleted` fields in the returned user object.
2.  **Date Handling**: Ensure `deadline` in Goals is stored as a proper Date object so the frontend can calculate "Days Left" accurately.
3.  **Validation**: Fixed expenses `amount` should be forced to `Number` on the server to avoid calculation errors in the Analytics Engine.

---

## 5. Security Note
All these routes MUST be protected by the `protect` middleware to ensure users can only see/edit their own financial data.
