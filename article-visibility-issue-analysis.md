# Article Visibility Issue Analysis

## Problem Description
Articles added through the admin dashboard are not appearing in the user dashboard, even though they exist in the Neon database.

## Root Cause Analysis

### Database Schema
The `articles` table has a `published` boolean field that defaults to `false`:
```sql
published: boolean("published").default(false)
```

### Admin Dashboard Behavior
In the admin form (`client/src/pages/admin.tsx`), the "Status" field defaults to "Draft" (false):
```jsx
<Select name="published" defaultValue="false">
  <SelectContent>
    <SelectItem value="false">Draft</SelectItem>
    <SelectItem value="true">Published</SelectItem>
  </SelectContent>
</Select>
```

### User Dashboard Filtering
Both the articles page and home page only query for published articles:
```jsx
// articles.tsx
queryKey: ["/api/articles", { published: "true" }]

// home.tsx  
queryKey: ["/api/articles", { published: "true" }]
```

### Server-Side Filtering
The API endpoint filters articles based on the `published` parameter:
```javascript
// server/routes.ts
if (published === "true") {
  articles = await storage.getPublishedArticles();
}

// server/storage.ts
async getPublishedArticles(): Promise<Article[]> {
  return Array.from(this.articles.values()).filter(a => a.published);
}
```

## The Issue
When creating articles in the admin dashboard, users are not explicitly changing the status from "Draft" to "Published", so articles are saved with `published: false` and don't appear in the user-facing pages.

## Solutions

### Solution 1: Change Default to Published (Recommended)
Change the default value in the admin form to "Published":

```jsx
<Select name="published" defaultValue="true">
```

### Solution 2: Add Visual Indicator
Add a visual indicator in the admin form to make the published status more prominent:

```jsx
<div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
  <Label htmlFor="published" className="text-sm font-medium text-yellow-800">
    Publication Status
  </Label>
  <p className="text-xs text-yellow-600 mb-2">
    Only published articles will appear on the website
  </p>
  <Select name="published" defaultValue="false">
    {/* ... existing options ... */}
  </Select>
</div>
```

### Solution 3: Add Published Status to Admin Article List
Show the published status in the admin article list to make it clear which articles are visible:

```jsx
<Badge variant={article.published ? "default" : "secondary"}>
  {article.published ? "Published" : "Draft"}
</Badge>
```

### Solution 4: Add Quick Publish Action
Add a quick publish/unpublish toggle in the admin article list.

## Immediate Fix
The quickest fix is to change the default value in the admin form from "false" to "true" so that new articles are published by default.

## Verification Steps
1. Check existing articles in the database - they likely have `published: false`
2. For existing draft articles, either:
   - Update them manually in the database: `UPDATE articles SET published = true WHERE published = false`
   - Add an "Edit" feature in the admin dashboard to change the status
3. Test creating new articles with the fixed default value

## Files Involved
- `client/src/pages/admin.tsx` - Admin form with published field
- `client/src/pages/articles.tsx` - User articles page
- `client/src/pages/home.tsx` - Home page with latest articles
- `server/routes.ts` - API routes handling article filtering
- `server/storage.ts` - Storage layer with published article filtering
- `shared/schema.ts` - Database schema definition