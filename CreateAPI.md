# Create API - Backend Checklist for Admin

Ngay ben frontend hien tai, admin panel da su dung dang nhap, lay profile, va CRUD danh muc. Tai lieu nay tong hop toan bo API can thiet de backend trien khai theo thu tu uu tien.

## 1. API bat buoc cho MVP (de chay duoc admin hien tai)

### 1.1 Auth

#### POST /api/auth/login
- Muc dich: Xac thuc Firebase ID token va dong bo user backend.
- Header: Authorization: Bearer <firebaseIdToken>
- Auth: Bat buoc.
- Response 200: UserResponse.

Huong dan code:
1. Controller: dung endpoint da co trong AuthController#login.
2. Service: cap nhat AuthService#syncUserFromFirebase de role mac dinh la USER, va bo sung rule chan neu user.status = BANNED/LOCKED.
3. Security: giu FirebaseAuthFilter verify token va set Authentication.
4. Rule admin panel: neu login vao admin thi check role = ADMIN, neu khong thi tra 403 voi message ro rang.
5. Error handling: bo sung bat FirebaseAuthException va tra 401 theo RestResponse thong nhat.

### 1.2 User

#### GET /api/users/me
- Muc dich: Lay thong tin user dang dang nhap.
- Header: Authorization: Bearer <accessToken>
- Auth: Bat buoc.
- Response 200: UserResponse.

Huong dan code:
1. Controller: dung endpoint da co trong UserController#getProfile.
2. Service: trong UserService#getMyProfile, tiep tuc tinh completedJobs, totalReviews, averageRating.
3. Toi uu: responseRate dang hardcode, nen doi sang tinh tu du lieu conversation/message khi co bang message.
4. Error handling: neu khong tim thay user theo firebaseUid thi nem NotFoundException de GlobalException xu ly.

### 1.3 Categories

#### GET /api/categories
- Muc dich: Lay danh sach danh muc.
- Header: Authorization: Bearer <accessToken>
- Auth: ADMIN.
- Query de xai tot cho admin:
  - page, limit
  - search
  - sortBy, sortOrder
  - isActive
- Response 200:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Dien nuoc",
      "iconUrl": "https://.../icon.svg",
      "colorCode": "#f97316",
      "description": "Sua chua dien nuoc",
      "isActive": true,
      "createdAt": "2026-04-05T10:00:00.000Z",
      "updatedAt": "2026-04-05T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

Huong dan code:
1. Controller: sua CategoryController#getAllCategories de nhan query param page, limit, search, sortBy, sortOrder, isActive.
2. Service: them method phan trang + filter (co the dung Pageable + Specification hoac query trong CategoryRepository).
3. Repository: them ham tim kiem theo ten (contains ignore case) va loc trang thai neu co cot isActive.
4. DTO: nen tao response pagination giong ResultPaginationDTO hoac thong nhat 1 dinh dang data/meta.
5. Security: nen them @PreAuthorize("hasRole('ADMIN')") cho endpoint nay de dung voi admin panel.

#### GET /api/categories/:id
- Muc dich: Lay chi tiet 1 danh muc.
- Header: Authorization: Bearer <accessToken>
- Auth: ADMIN.
- Response 200: CategoryResponse.

Huong dan code:
1. Controller: endpoint da co CategoryController#getCategoryById.
2. Service: getCategoryById da co, nen doi RuntimeException thanh NotFoundException.
3. Validation: id nen de kieu Long ngay tu controller thay vi parse String -> Long.
4. Security: them @PreAuthorize("hasRole('ADMIN')") neu chi admin duoc xem.

#### POST /api/categories
- Muc dich: Tao danh muc moi.
- Header: Authorization: Bearer <accessToken>
- Auth: ADMIN.
- Request body:

```json
{
  "name": "Dien nuoc",
  "iconUrl": "https://.../icon.svg",
  "colorCode": "#f97316",
  "description": "Sua chua dien nuoc"
}
```

- Response 201: CategoryResponse.
- Validation:
  - name: required, unique.
  - colorCode: dung dinh dang hex (#RRGGBB).
  - iconUrl: required.

Huong dan code:
1. Controller: endpoint da co voi @Valid va @PreAuthorize.
2. Request DTO: bo sung regex cho colorCode trong CategoryRequest, vi du ^#[0-9A-Fa-f]{6}$.
3. Repository: them existsByNameIgnoreCase de check unique ten danh muc truoc khi save.
4. Service: neu trung ten thi tra loi 409 (Conflict) bang custom exception.
5. HTTP code: nen tra 201 Created thay vi 200.

#### PUT /api/categories/:id
- Muc dich: Cap nhat danh muc.
- Header: Authorization: Bearer <accessToken>
- Auth: ADMIN.
- Request body: giong create.
- Response 200: CategoryResponse.

Huong dan code:
1. Controller: endpoint da co voi @PreAuthorize.
2. Service: update da co mapper.updateEntity, can check duplicate name tru id hien tai.
3. Repository: them existsByNameIgnoreCaseAndIdNot.
4. Cache: dang co @Caching evict hop ly, giu nguyen.
5. Error: chuyen RuntimeException thanh NotFoundException/BusinessException ro nghia.

#### DELETE /api/categories/:id
- Muc dich: Xoa danh muc.
- Header: Authorization: Bearer <accessToken>
- Auth: ADMIN.
- Response 204.
- Khuyen nghi:
  - Uu tien soft delete neu danh muc da gan voi du lieu khac.

Huong dan code:
1. Controller: endpoint da co.
2. Entity: them cot isDeleted hoac isActive cho Category neu muon soft delete.
3. Service: doi deleteById thanh update trang thai, tranh vo khoa ngoai voi jobs.
4. Query lay danh sach: bo qua category da xoa mem.
5. Neu van xoa cung: check rang buoc du lieu lien quan truoc khi xoa.

## 2. API nen them ngay sau MVP

### 2.1 Category status

#### PATCH /api/categories/:id/status
- Muc dich: Bat/Tat danh muc thay vi xoa cung.
- Header: Authorization: Bearer <accessToken>
- Auth: ADMIN.
- Request body:

```json
{
  "isActive": false
}
```

- Response 200: CategoryResponse.

Huong dan code:
1. Them request DTO moi: UpdateCategoryStatusRequest { Boolean isActive }.
2. Controller: them @PatchMapping("/{id}/status") trong CategoryController.
3. Service: tim category theo id, cap nhat isActive, save va tra response.
4. Repository/query list: loc isActive theo query param o GET /api/categories.
5. Frontend admin: uu tien dung endpoint nay thay vi delete cung.

### 2.2 Upload signing

#### POST /api/uploads/sign
- Muc dich: Tao chu ky upload cho Cloudinary/S3.
- Header: Authorization: Bearer <accessToken>
- Auth: ADMIN.
- Request body (vi du):

```json
{
  "fileName": "icon.svg",
  "fileType": "image/svg+xml",
  "folder": "categories"
}
```

- Response 200 (vi du):

```json
{
  "uploadUrl": "https://...",
  "fields": {
    "key": "...",
    "policy": "...",
    "signature": "..."
  },
  "publicUrl": "https://.../icon.svg"
}
```

Huong dan code:
1. Tao UploadController moi, route /api/uploads.
2. Tao UploadService tao signed params (Cloudinary API secret hoac AWS S3 pre-signed URL).
3. Security: bat buoc ADMIN.
4. Khong luu secret o frontend, doc tu application.properties/.env.
5. Validate fileType va folder theo whitelist de tranh abuse.

### 2.3 Dashboard summary

#### GET /api/admin/dashboard/summary
- Muc dich: Do du lieu that cho trang dashboard.
- Header: Authorization: Bearer <accessToken>
- Auth: ADMIN.
- Response 200:

```json
{
  "totalUsers": 1234,
  "newJobs": 56,
  "monthlyRevenue": 15000000,
  "pendingReports": 12
}
```

Huong dan code:
1. Tao AdminDashboardController voi route /api/admin/dashboard/summary.
2. Tao AdminDashboardService tong hop so lieu tu UserRepository, JobRepository, bang giao dich (neu co).
3. Tinh monthlyRevenue theo thang hien tai (first day -> now).
4. pendingReports tam thoi co the tra 0 neu chua co module report, de TODO ro rang.
5. Security: @PreAuthorize("hasRole('ADMIN')").

### 2.4 Healthcheck

#### GET /api/health
- Muc dich: Kiem tra service song.
- Auth: Khong bat buoc.
- Response 200:

```json
{
  "status": "ok",
  "time": "2026-04-05T10:00:00.000Z"
}
```

Huong dan code:
1. Tao HealthController voi GET /api/health.
2. SecurityConfiguration: permitAll cho /api/health.
3. Tra thong tin toi thieu: status, time, appVersion (neu co).
4. Khong expose thong tin nhay cam (db password, env).

## 3. API quan ly nguoi dung (vi menu admin da co)

#### GET /api/admin/users
- Muc dich: Danh sach user cho admin.
- Query: page, limit, search, role, status, createdFrom, createdTo.

Huong dan code:
1. Tao AdminUserController moi (khong tron vao UserController /api/users/me).
2. Tao UserFilterRequest hoac dung @RequestParam + Pageable.
3. Repository: dung JpaSpecificationExecutor cho UserRepository de loc dong.
4. Mapper: tra ve UserResponse gon cho danh sach (co the tao UserAdminListResponse).
5. Security: @PreAuthorize("hasRole('ADMIN')").

#### GET /api/admin/users/:id
- Muc dich: Chi tiet user.

Huong dan code:
1. Controller: them GET /api/admin/users/{id}.
2. Service: tim user theo id, nem NotFoundException neu khong co.
3. Co the mo rong response gom thong ke jobs/reviews giong getMyProfile.

#### PATCH /api/admin/users/:id/status
- Muc dich: Khoa/mo user.
- Body:

```json
{
  "status": "BANNED"
}
```

Huong dan code:
1. Tao request DTO UpdateUserStatusRequest voi enum UserStatus.
2. Service: cap nhat status va save.
3. Rule an toan: chan admin tu khoa chinh minh.
4. Neu status = BANNED, co the revoke token bang Firebase Admin SDK (neu ap dung).

#### PATCH /api/admin/users/:id/role
- Muc dich: Doi role user neu duoc phep.
- Body:

```json
{
  "role": "ADMIN"
}
```

Huong dan code:
1. Tao request DTO UpdateUserRoleRequest voi enum UserRole.
2. Service: cap nhat role trong DB.
3. Dong bo Firebase custom claims qua FirebaseService#setUserRole.
4. Rule an toan: chi SUPER ADMIN moi duoc cap role ADMIN (neu he thong co cap quyen).

#### POST /api/admin/users/:id/reset-session
- Muc dich: Thu hoi phien dang nhap.

Huong dan code:
1. Dung Firebase Admin SDK revokeRefreshTokens(uid).
2. Service: map userId -> firebaseUid, goi revoke.
3. Tra ve 200 voi message "Session revoked".
4. Ghi audit log hanh dong nay.

## 4. API quan ly cong viec (vi menu admin da co)

#### GET /api/admin/jobs
- Muc dich: Danh sach cong viec.
- Query: page, limit, search, status, categoryId, region, createdFrom, createdTo.

Huong dan code:
1. Tao AdminJobController moi duoi /api/admin/jobs.
2. Tai su dung JobSpecification va mo rong them search/category/region/date range.
3. Repository: da co JpaSpecificationExecutor trong JobRepository, co the dung ngay.
4. Tra ve co phan trang (meta + result/data) de frontend admin de xu ly.

#### GET /api/admin/jobs/:id
- Muc dich: Chi tiet cong viec.

Huong dan code:
1. Tai su dung JobService#getJobById.
2. Neu can thong tin sau hon (nguoi tao, helper, anh, lich su), tao JobAdminDetailResponse rieng.
3. Xu ly 404 voi NotFoundException.

#### PATCH /api/admin/jobs/:id/status
- Muc dich: Duyet/an/tu choi cong viec.
- Body:

```json
{
  "status": "APPROVED",
  "reason": "Noi dung hop le"
}
```

Huong dan code:
1. Luu y enum hien tai la OPEN/IN_PROGRESS/COMPLETED/CANCELLED/CLOSED/ASSIGNED, chua co APPROVED.
2. Chon 1 trong 2 huong:
   - Bo sung enum moi cho luong duyet (PENDING/APPROVED/REJECTED).
   - Hoac map APPROVED -> OPEN, REJECTED -> CLOSED/CANCELLED theo rule.
3. Tao UpdateJobStatusRequest va endpoint PATCH.
4. Luu ly do reason vao cot phu (vd moderationNote) neu can truy vet.

#### PATCH /api/admin/jobs/:id
- Muc dich: Chinh sua metadata co ban (title, price, category...).

Huong dan code:
1. Tao UpdateJobRequest cho field cho phep sua.
2. Service: validate categoryId ton tai truoc khi cap nhat.
3. Khong cho sua field nhay cam neu da completed (rule nghiep vu).
4. Cap nhat updatedAt (neu entity co auditing cho update).

#### DELETE /api/admin/jobs/:id
- Muc dich: Xoa cong viec (nen soft delete).

Huong dan code:
1. Uu tien soft delete voi cot isDeleted/isVisible.
2. Neu xoa cung, can check review/payment/conversation lien quan.
3. Tra 204 neu thanh cong.
4. Audit log ai da xoa va ly do xoa.

## 5. Chuan hoa response va error (rat nen co)

### 5.1 Chuan loi
Tat ca endpoint nen tra loi loi theo 1 format thong nhat:

```json
{
  "code": "CATEGORY_NAME_EXISTS",
  "message": "Danh muc da ton tai",
  "details": null,
  "traceId": "req-123456"
}
```

### 5.2 Chuan phan trang
Tat ca list endpoint nen theo format:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## 6. Rule phan quyen khuyen nghi
- Public: GET /api/health
- Auth user: GET /api/users/me
- Auth admin:
  - /api/categories/*
  - /api/uploads/sign
  - /api/admin/*

## 7. Danh sach endpoint tong hop nhanh

### MVP can co ngay
- POST /api/auth/login
- GET /api/users/me
- GET /api/categories
- GET /api/categories/:id
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

### Nen co tiep theo
- PATCH /api/categories/:id/status
- POST /api/uploads/sign
- GET /api/admin/dashboard/summary
- GET /api/health

### Mo rong theo menu admin
- GET /api/admin/users
- GET /api/admin/users/:id
- PATCH /api/admin/users/:id/status
- PATCH /api/admin/users/:id/role
- POST /api/admin/users/:id/reset-session
- GET /api/admin/jobs
- GET /api/admin/jobs/:id
- PATCH /api/admin/jobs/:id/status
- PATCH /api/admin/jobs/:id
- DELETE /api/admin/jobs/:id

---
Tai lieu nay duoc viet dua tren frontend hien tai cua admin panel va uu tien de backend trien khai theo giai doan, tranh lam thieu endpoint can thiet.

## 8. Thu tu implement de code nhanh va it loi
1. Chuan hoa exception + RestResponse truoc (de tat ca API tra ve dong nhat).
2. Hoan thien nhom Categories (vi frontend dang dung truc tiep).
3. Them /api/admin/dashboard/summary va /api/health.
4. Tao khung /api/admin/users.
5. Tao khung /api/admin/jobs.
6. Cuoi cung moi them upload signing va reset-session.

## 9. Checklist test nhanh sau moi API
1. Test 401 khi khong co token.
2. Test 403 khi role USER goi API ADMIN.
3. Test input invalid (400).
4. Test not found (404).
5. Test happy path dung schema frontend dang mong doi.