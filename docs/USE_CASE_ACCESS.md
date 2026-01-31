# Use Case & Access Control Documentation

## 1. System Actors (Roles)

Based on the database schema (`Role` enum), the system supports the following roles:

| Role           | Description                                                                                       |
| :------------- | :------------------------------------------------------------------------------------------------ |
| **ADMIN**      | Full system access. Can manage master data, users, and overall system configuration.              |
| **GUDANG**     | Inventory management. Focuses on Stock, Goods In/Out (`Barang Masuk`/`Keluar`).                   |
| **PURCHASING** | Procurement focus. Manages Suppliers, Purchase Orders (PO), and Supplier Invoices (`Tagihan`).    |
| **PRODUKSI**   | Production focus. Manages Vehicles (`Kendaraan`), Work Orders (`Spek Order`), and Vehicle Status. |
| **USER**       | Basic access (likely limited read-only or self-service features, currently default).              |

---

## 2. Menu Access Matrix

_Note: Currently, the frontend Sidebar displays all menus. Below is the **logical** access control typically associated with these modules in this domain._

| Menu Group              | Submenu                       | Accessible By                         |
| :---------------------- | :---------------------------- | :------------------------------------ |
| **Dashboard**           | /                             | All Roles                             |
| **Menu Master**         | Kategori, Satuan, Merek, Tipe | **ADMIN**                             |
| **Manajemen Barang**    | Data Barang, Harga Barang     | **ADMIN**, **GUDANG**, **PURCHASING** |
|                         | Data Supplier                 | **PURCHASING**, **ADMIN**             |
|                         | Purchase Order, Konfirmasi PO | **PURCHASING**, **ADMIN**             |
|                         | Barang Masuk                  | **GUDANG**, **ADMIN**                 |
|                         | Barang Keluar                 | **GUDANG**, **PRODUKSI**, **ADMIN**   |
|                         | Tagihan Supplier              | **PURCHASING**, **ADMIN**             |
| **Manajemen Karyawan**  | /karyawan                     | **HR** (if exists), **ADMIN**         |
| **Project / Penawaran** | /project                      | **SALES** (if exists), **ADMIN**      |
| **Manajemen Kendaraan** | Data Kendaraan, Customer      | **ADMIN**, **PRODUKSI**               |
|                         | Kendaraan Masuk / Keluar      | **PRODUKSI**, **GUDANG**, **ADMIN**   |
|                         | Spek Order                    | **PRODUKSI**, **ADMIN**               |
| **Laporan**             | /laporan                      | **ADMIN**, **OWNER**, **PURCHASING**  |

---

## 3. Credentials (Development Environment)

The system is seeded with default accounts for each role.

| Username     | Password        | Role           |
| :----------- | :-------------- | :------------- |
| `admin`      | `admin123`      | **ADMIN**      |
| `gudang`     | `gudang123`     | **GUDANG**     |
| `purchasing` | `purchasing123` | **PURCHASING** |
| `produksi`   | `produksi123`   | **PRODUKSI**   |

_Source: `prisma/seed.ts`_

---

## 4. Use Case Diagram (Mermaid)

```mermaid
usecaseDiagram
    actor "Admin" as A
    actor "Staff Gudang" as G
    actor "Staff Purchasing" as P
    actor "Staff Produksi" as Pr

    package "Manajemen Master & User" {
        usecase "Manage Master Data" as UC1
        usecase "Manage Karyawan" as UC2
        usecase "View Laporan" as UC3
    }

    package "Manajemen Barang" {
        usecase "Manage Barang" as UC4
        usecase "Input Barang Masuk" as UC5
        usecase "Input Barang Keluar" as UC6
        usecase "Check Stock" as UC7
    }

    package "Procurement" {
        usecase "Manage Supplier" as UC8
        usecase "Create Purchase Order" as UC9
        usecase "Confirm Tagihan" as UC10
    }

    package "Produksi / Karoseri" {
        usecase "Manage Kendaraan" as UC11
        usecase "Input Spek Order" as UC12
        usecase "Update Status Pengerjaan" as UC13
        usecase "Manage Customer" as UC14
    }

    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC8
    A --> UC11

    G --> UC4
    G --> UC5
    G --> UC6
    G --> UC7

    P --> UC8
    P --> UC9
    P --> UC10
    P --> UC4
    P --> UC3

    Pr --> UC11
    Pr --> UC12
    Pr --> UC13
    Pr --> UC14
    Pr --> UC6
```
