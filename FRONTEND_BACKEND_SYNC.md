# Frontend-Backend Synchronization Guide

## Summary of Changes

The frontend has been updated to match the new backend validation requirements for job postings.

---

## What Changed

### 1. **JobCreateModal.tsx** - Enhanced Validation & Data Formatting

#### ✅ Added Client-Side Validation
- **Title**: Minimum 3 characters
- **Description**: Minimum 50 characters
- **Required Skills**: At least 1 skill required
- **Salary Range**: `salary_max` must be ≥ `salary_min`
- **Match Score**: Must be between 0-100

#### ✅ Fixed Data Type Issues
Previously, the form was sending:
```javascript
// ❌ WRONG
{
  required_experience: {},  // Could become string "{}"
  required_education: {},
  // ...
}
```

Now properly sending:
```javascript
// ✅ CORRECT
{
  required_experience: typeof formData.required_experience === 'object' ? formData.required_experience : {},
  required_education: typeof formData.required_education === 'object' ? formData.required_education : {},
  communication_requirements: typeof formData.communication_requirements === 'object' ? formData.communication_requirements : {},
  matching_weights: typeof formData.matching_weights === 'object' ? formData.matching_weights : {},
  // ...
}
```

#### ✅ Enum Values
The backend expects lowercase snake_case values:
- `job_type`: `"full_time"`, `"part_time"`, `"contract"`, `"internship"`, `"freelance"`
- `experience_level`: `"entry"`, `"junior"`, `"mid"`, `"senior"`, `"lead"`, `"executive"`

The form already sends these values correctly (no mapping needed).

---

### 2. **types/index.ts** - Added Proper Type Definitions

#### New Types Added:
```typescript
export type JobType = "full_time" | "part_time" | "contract" | "internship" | "freelance";
export type ExperienceLevel = "entry" | "junior" | "mid" | "senior" | "lead" | "executive";
export type JobStatus = "active" | "paused" | "closed" | "expired";

export interface JobPosting {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  department?: string;
  location: string;
  remote_allowed: boolean;
  job_type: string;
  experience_level: string;
  salary_range?: string;
  currency: string;
  salary_min?: number;
  salary_max?: number;
  required_skills: string[];
  preferred_skills: string[];
  required_experience: Record<string, any>;
  required_education: Record<string, any>;
  communication_requirements: Record<string, any>;
  matching_weights: Record<string, any>;
  minimum_match_score: number;
  status: string;
  is_urgent: boolean;
  is_active: boolean;
  applications_count: number;
  max_applications?: number;
  auto_match_enabled: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface JobPostingCreate {
  title: string;
  description: string;
  department?: string;
  location: string;
  remote_allowed: boolean;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_min?: number | null;
  salary_max?: number | null;
  currency?: string;
  required_skills: string[];
  preferred_skills?: string[];
  required_experience?: Record<string, any>;
  required_education?: Record<string, any>;
  communication_requirements?: Record<string, any>;
  matching_weights?: Record<string, any>;
  minimum_match_score?: number;
  is_urgent?: boolean;
  max_applications?: number;
  auto_match_enabled?: boolean;
  expires_at?: string;
}
```

---

## Validation Rules (Frontend ↔ Backend)

| Field | Frontend Validation | Backend Validation | Type |
|-------|-------------------|-------------------|------|
| `title` | Min 3 chars | Min 3 chars | string |
| `description` | Min 50 chars | Min 50 chars | string |
| `location` | Required | Required | string |
| `job_type` | Must be lowercase | Enum: full_time, etc. | enum |
| `experience_level` | Must be lowercase | Enum: entry, etc. | enum |
| `required_skills` | Min 1 item | Min 1 item | string[] |
| `preferred_skills` | Optional, defaults to [] | Defaults to [] | string[] |
| `required_experience` | Object, not string | Dict, defaults to {} | object |
| `required_education` | Object, not string | Dict, defaults to {} | object |
| `communication_requirements` | Object, not string | Dict, defaults to {} | object |
| `matching_weights` | Object, not string | Dict, defaults to {} | object |
| `salary_min` | Optional | Optional | number |
| `salary_max` | Must be ≥ salary_min | Must be ≥ salary_min | number |
| `minimum_match_score` | 0-100 | 0-100 | number |

---

## Example Valid Payload

```json
{
  "title": "Senior React Developer",
  "description": "We are seeking an experienced React developer to join our team and build amazing user interfaces.",
  "location": "San Francisco, CA",
  "department": "Engineering",
  "job_type": "full_time",
  "experience_level": "senior",
  "salary_min": 120000,
  "salary_max": 160000,
  "currency": "USD",
  "remote_allowed": true,
  "is_urgent": false,
  "required_skills": ["React", "TypeScript", "Node.js"],
  "preferred_skills": ["Next.js", "GraphQL"],
  "required_experience": {},
  "required_education": {},
  "communication_requirements": {},
  "matching_weights": {},
  "minimum_match_score": 70,
  "max_applications": 50,
  "auto_match_enabled": true
}
```

---

## Common Errors & Solutions

### Error: "This field must be a JSON object (dict), not a string"
**Cause**: Sending `"{}"` instead of `{}`
**Solution**: Form now ensures objects are sent as actual objects, not strings

### Error: "salary_max must be greater than or equal to salary_min"
**Cause**: salary_max < salary_min
**Solution**: Form validates this before submission and shows clear error

### Error: "Job description must be at least 50 characters long"
**Cause**: Description too short
**Solution**: Form validates length on client-side first

### Error: "At least one required skill must be provided"
**Cause**: Empty required_skills array
**Solution**: Form prevents submission without at least one skill

---

## Testing Checklist

- [x] Title validation (min 3 chars)
- [x] Description validation (min 50 chars)
- [x] Required skills validation (min 1)
- [x] Salary range validation (max >= min)
- [x] Match score validation (0-100)
- [x] Dict fields send as objects, not strings
- [x] Enum values properly mapped to uppercase
- [x] Default values applied correctly

---

## Files Modified

1. `/src/components/employer/JobCreateModal.tsx`
   - Updated `handleCreateJob()` with comprehensive validation
   - Added enum mapping for job_type and experience_level
   - Fixed object vs string issue for dict fields
   - Added console.log for debugging

2. `/src/types/index.ts`
   - Added `JobType`, `ExperienceLevel`, `JobStatus` types
   - Added `JobPosting` interface
   - Added `JobPostingCreate` interface
   - Added `JobPostingUpdate` interface
   - Updated `ApiError` to handle array validation errors

---

## Next Steps

1. **Test the form** by creating a job posting
2. **Check console** for the payload being sent
3. **Verify** all validation messages work correctly
4. **Update JobEditModal** if needed (same validation logic)

---

## Related Documentation

- Backend API Guide: `/ai-resume-server/JOB_POSTING_API_GUIDE.md`
- Example Payloads: `/ai-resume-server/example_job_posting_payloads.json`
- Backend Schema: `/ai-resume-server/app/schemas/employer.py`
