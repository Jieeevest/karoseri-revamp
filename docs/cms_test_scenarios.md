# CMS Test Scenarios

## 1. Authentication

- **Login Success**: Valid credentials -> Redirect to dashboard.
- **Login Failure**: Invalid credentials -> Show error message.
- **Logout**: Click logout -> Redirect to login page.

## 2. Dashboard

- **Load Stats**: Verify dashboard loads with correct statistic cards.

## 3. Master Data

### Kategori Barang

- **Create**: Add new category -> Verify in list.
- **Edit**: Update category -> Verify change.
- **Delete**: Remove category -> Verify removal.

### Satuan Barang

- **Create**: Add new unit -> Verify in list.
- **Delete**: Remove unit -> Verify removal.

### Merek Kendaraan

- **Create**: Add new brand -> Verify in list.
- **Delete**: Remove brand -> Verify removal.

### Tipe Kendaraan

- **Create**: Add new type (linked to brand) -> Verify in list.
- **Delete**: Remove type -> Verify removal.

## 4. Barang (Inventory)

### Data Barang

- **Create**: Add new item -> Verify in list.
- **Edit**: Update item details -> Verify change.
- **Delete**: Remove item -> Verify removal.
- **Search**: Search for item -> Verify result.

### Purchase Order (PO)

- **Create PO**: Select supplier, add items -> Submit -> Verify PO created.
- **Konfirmasi PO**: Approve/Reject PO -> Verify status change.

### Barang Masuk (Inbound)

- **Receive Goods**: Select PO -> Input quantity -> Submit -> Verify inventory increase.

### Barang Keluar (Outbound)

- **Issue Goods**: Select item -> Input quantity -> Submit -> Verify inventory decrease.

## 5. Kendaraan (Vehicle Management)

### Customer

- **Create**: Add new customer -> Verify in list.
- **Edit**: Update customer details -> Verify change.

### Data Kendaraan

- **Create**: Add new vehicle -> Verify in list.
- **History**: View service/part history.

### Spek Order/Work Order

- **Create**: Create new SPK -> Verify in list.
- **Progress**: Update progress -> Verify status.

## 6. Karyawan (Employees)

- **Create**: Add new employee -> Verify in list.
- **Edit**: Update details -> Verify change.
- **Delete**: Remove employee -> Verify removal.

## 7. Project

- **Create**: Add new project -> Verify in list.
- **Update**: Update project status.

## 8. General

- **Navigation**: Verify sidebar links work.
- **Responsive**: Verify layout on mobile view (basic check).
