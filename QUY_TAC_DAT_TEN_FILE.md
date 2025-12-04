# Quy tắc đặt tên file và thư mục cho upload dữ liệu nhân viên hàng loạt

## Cấu trúc file ZIP

File ZIP cần chứa:

1. **1 file Excel** (.xlsx hoặc .xls) chứa thông tin tất cả nhân viên
2. **Thư mục ảnh** cho mỗi nhân viên (mỗi nhân viên có 8 ảnh)

### Ví dụ cấu trúc

employees_batch.zip
├── employees.xlsx                    (File Excel chứa thông tin)
├── MNS001/                           (Thư mục nhân viên 1)
│   ├── front1.jpg                    (Nhìn thẳng có biểu cảm)
│   ├── front2.jpg                    (Nhìn thẳng không biểu cảm)
│   ├── left1.jpg                     (Nhìn trái 20° có biểu cảm)
│   ├── left2.jpg                     (Nhìn trái 20° không biểu cảm)
│   ├── right1.jpg                    (Nhìn phải 20° có biểu cảm)
│   ├── right2.jpg                    (Nhìn phải 20° không biểu cảm)
│   ├── up.jpg                        (Nhìn lên 20°)
│   └── down.jpg                      (Nhìn xuống 20°)
└── MNS002/                           (Thư mục nhân viên 2)
    ├── front1.jpg
    ├── front2.jpg
    └── ...

## 1. File Excel (.xlsx hoặc .xls)

### Tên file

- Có thể đặt tên bất kỳ, nhưng phải có đuôi `.xlsx` hoặc `.xls`
- Ví dụ: `employees.xlsx`, `danh_sach_nhan_vien.xlsx`, `data.xlsx`

### Cấu trúc cột (Sheet đầu tiên)

File Excel phải có các cột sau (tên cột có thể viết hoa/thường, có dấu/không dấu):

| Tên cột được hỗ trợ | Mô tả | Bắt buộc |
|---------------------|-------|-----------|
| **Mã nhân sự** | Mã nhân viên (ví dụ: MNS001, MNS002) | ✅ Bắt buộc |
| **Họ và tên** | Tên đầy đủ của nhân viên | ✅ Bắt buộc |
| **Giới tính** | Nam hoặc Nữ | ✅ Bắt buộc |
| **Email công ty** | Email của nhân viên | ✅ Bắt buộc |
| **Phòng** | Tên phòng ban | ⚪ Tùy chọn |
| **Bộ phận** | Tên bộ phận/chức vụ | ⚪ Tùy chọn |
| **Số phòng làm việc** | Số phòng làm việc | ⚪ Tùy chọn |

### Tên cột được hỗ trợ (case-insensitive, không phân biệt dấu)

**Mã nhân sự:**

- `Mã nhân sự`, `MNS`, `Mã NV`, `Employee ID`, `ID`, `Mã nhân viên`

**Họ và tên:**

- `Họ và tên`, `Họ tên`, `Tên`, `Full Name`, `Name`

**Giới tính:**

- `Giới tính`, `Gender`, `Sex`

**Email công ty:**

- `Email`, `Email công ty`, `Account`, `Tài khoản`

**Phòng:**

- `Phòng`, `Department`, `Phòng ban`

**Bộ phận:**

- `Bộ phận`, `Position`, `Chức vụ`, `Chức danh`

**Số phòng làm việc:**

- `Số phòng làm việc`, `Phòng làm việc`, `Workplace`, `Room`, `Phòng`

### Ví dụ file Excel

| Mã nhân sự | Họ và tên | Giới tính | Email công ty | Phòng | Bộ phận | Số phòng làm việc |
|------------|-----------|-----------|--------------|-------|---------|-------------------|
| MNS001 | Nguyễn Văn A | Nam | <nguyenvana@company.com> | Phòng CNTT | Developer | Phòng 10.01 |
| MNS002 | Trần Thị B | Nữ | <tranthib@company.com> | Phòng Tài chính | Accountant | Phòng 09.01 |

## 2. Thư mục ảnh nhân viên

### Tên thư mục

- **Format:** `{Mã nhân sự}` hoặc `{Mã nhân sự}_{Tên}`
- **Ví dụ:**
  - `MNS001`
  - `MNS001_NguyenVanA`
  - `MNS002_TranThiB`
- **Lưu ý:** Tên thư mục phải chứa **Mã nhân sự** trùng với cột "Mã nhân sự" trong file Excel

### Quy tắc đặt tên file ảnh

Mỗi nhân viên cần **8 ảnh** với các tên file như sau:

#### 2.1. Ảnh nhìn thẳng (2 ảnh)

- **Có biểu cảm:**
  - `front1.jpg`, `front_1.jpg`, `nhin_thang_1.jpg`, `straight_expression.jpg`
  - Hoặc chứa từ khóa: `front`, `thang`, `truoc`, `straight` + `1`, `first`, `expression`, `bieu_cam`
- **Không biểu cảm:**
  - `front2.jpg`, `front_2.jpg`, `nhin_thang_2.jpg`, `straight_no_expression.jpg`
  - Hoặc chứa từ khóa: `front`, `thang`, `truoc`, `straight` + `2`, `second`, `no_expression`, `khong_bieu_cam`, `neutral`

#### 2.2. Ảnh nhìn trái 20° (2 ảnh)

- **Có biểu cảm:**
  - `left1.jpg`, `left_1.jpg`, `trai_20_1.jpg`, `left_expression.jpg`
  - Hoặc chứa từ khóa: `left`, `trai` + `1`, `first`, `expression`, `bieu_cam`
- **Không biểu cảm:**
  - `left2.jpg`, `left_2.jpg`, `trai_20_2.jpg`, `left_no_expression.jpg`
  - Hoặc chứa từ khóa: `left`, `trai` + `2`, `second`, `no_expression`, `khong_bieu_cam`, `neutral`

#### 2.3. Ảnh nhìn phải 20° (2 ảnh)

- **Có biểu cảm:**
  - `right1.jpg`, `right_1.jpg`, `phai_20_1.jpg`, `right_expression.jpg`
  - Hoặc chứa từ khóa: `right`, `phai` + `1`, `first`, `expression`, `bieu_cam`
- **Không biểu cảm:**
  - `right2.jpg`, `right_2.jpg`, `phai_20_2.jpg`, `right_no_expression.jpg`
  - Hoặc chứa từ khóa: `right`, `phai` + `2`, `second`, `no_expression`, `khong_bieu_cam`, `neutral`

#### 2.4. Ảnh nhìn lên 20° (1 ảnh)

- `up.jpg`, `len.jpg`, `tren.jpg`, `up_20.jpg`, `look_up.jpg`
- Hoặc chứa từ khóa: `up`, `tren`, `len`

#### 2.5. Ảnh nhìn xuống 20° (1 ảnh)

- `down.jpg`, `xuong.jpg`, `duoi.jpg`, `down_20.jpg`, `look_down.jpg`
- Hoặc chứa từ khóa: `down`, `duoi`, `xuong`

### Định dạng ảnh hỗ trợ

- `.jpg`, `.jpeg`
- `.png`
- `.webp`

### Ví dụ đầy đủ cho 1 nhân viên

MNS001/
├── front1.jpg              (Nhìn thẳng có biểu cảm)
├── front2.jpg              (Nhìn thẳng không biểu cảm)
├── left1.jpg               (Nhìn trái 20° có biểu cảm)
├── left2.jpg               (Nhìn trái 20° không biểu cảm)
├── right1.jpg              (Nhìn phải 20° có biểu cảm)
├── right2.jpg              (Nhìn phải 20° không biểu cảm)
├── up.jpg                  (Nhìn lên 20°)
└── down.jpg                (Nhìn xuống 20°)

## 3. Quy tắc validation

### Bắt buộc

- ✅ File Excel phải có ít nhất 1 dòng dữ liệu
- ✅ Mỗi nhân viên phải có **Mã nhân sự**, **Họ và tên**, **Giới tính**, **Email công ty**
- ✅ Mỗi nhân viên phải có **ít nhất 1 ảnh nhìn thẳng** (front1 hoặc front2)

### Khuyến nghị

- ⭐ Mỗi nhân viên nên có đủ 8 ảnh để tăng độ chính xác nhận diện
- ⭐ Tên thư mục nên trùng với Mã nhân sự để dễ quản lý

## 4. Ví dụ hoàn chỉnh

/// Cấu trúc file ZIP

employees_2024_01_15.zip
├── employees.xlsx
├── MNS001/
│   ├── front1.jpg
│   ├── front2.jpg
│   ├── left1.jpg
│   ├── left2.jpg
│   ├── right1.jpg
│   ├── right2.jpg
│   ├── up.jpg
│   └── down.jpg
├── MNS002/
│   ├── front1.jpg
│   ├── front2.jpg
│   ├── left1.jpg
│   ├── left2.jpg
│   ├── right1.jpg
│   ├── right2.jpg
│   ├── up.jpg
│   └── down.jpg
└── MNS003/
    └── ...

### File Excel (employees.xlsx)

| Mã nhân sự | Họ và tên | Giới tính | Email công ty | Phòng | Bộ phận | Số phòng làm việc |
|------------|-----------|-----------|--------------|-------|---------|-------------------|
| MNS001 | Nguyễn Văn A | Nam | <nguyenvana@company.com> | Phòng CNTT | Developer | Phòng 10.01 |
| MNS002 | Trần Thị B | Nữ | <tranthib@company.com> | Phòng Tài chính | Accountant | Phòng 09.01 |
| MNS003 | Lê Văn C | Nam | <levanc@company.com> | Phòng Bán hàng | Sales | Phòng 11.01 |

## 5. Lưu ý quan trọng

1. **Mã nhân sự** trong file Excel phải trùng với tên thư mục chứa ảnh
2. Tên file ảnh không phân biệt hoa/thường
3. Hệ thống sẽ tự động chọn ảnh tốt nhất nếu có nhiều ảnh cùng loại (ưu tiên ảnh có biểu cảm)
4. Nếu thiếu ảnh, hệ thống vẫn sẽ xử lý nhưng có thể giảm độ chính xác nhận diện
5. File ZIP không được quá lớn (khuyến nghị < 100MB)

## 6. Xử lý lỗi

Nếu có lỗi, hệ thống sẽ hiển thị:

- Danh sách nhân viên hợp lệ
- Danh sách nhân viên có lỗi kèm thông báo lỗi cụ thể
- Bạn có thể xem chi tiết lỗi bằng cách click "Xem chi tiết"
