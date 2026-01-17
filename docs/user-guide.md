# Karoseri System - User Guide

Welcome to the **Karoseri System** user guide. This document provides step-by-step instructions for the end-to-end business processes, from procurement to vehicle delivery.

## Table of Contents

1.  [Flow 1: Procurement & Inventory](#flow-1-procurement--inventory)
2.  [Flow 2: Project & Production](#flow-2-project--production)
3.  [Flow 3: Quality Control & Delivery](#flow-3-quality-control--delivery)

---

## Flow 1: Procurement & Inventory

**Goal**: Ensure stock availability for production.

### Step-by-Step Guide

1.  **Check Stock**:
    - Go to **Manajemen Barang > Data Barang**.
    - Search for items. Red alerts indicate "Stok Menipis".
2.  **Request Restock (Purchase Order)**:
    - Go to **Manajemen Barang > Purchase Order**.
    - Click **"Buat PO Baru"**.
    - Select Supplier and add items (with quantity and price).
    - _System Status_: PO created with status `PENDING`.
3.  **Approve PO (Admin)**:
    - Go to **Manajemen Barang > Konfirmasi PO**.
    - Review pending POs. Click **"Approve"**.
    - _System Status_: PO updates to `APPROVED`.
4.  **Receive Goods (Barang Masuk)**:
    - When physical items arrive, go to **Manajemen Barang > Barang Masuk**.
    - Click **"Catat Barang Masuk"**.
    - Select the **Supplier** and the related **Approved PO**.
    - Input received quantity (Partial delivery is allowed).
    - _System Action_: Stock increases automatically. PO status updates to `RECEIVED` (if full) or remains `APPROVED` (if partial).

### Sequence Diagram (User Interaction)

```mermaid
sequenceDiagram
    actor Gudang as Staff Gudang
    actor Admin as Admin/Manager
    participant System as Karoseri System

    %% Step 1: Request Stock
    Gudang->>System: Check "Data Barang" (Stok Menipis)
    Gudang->>System: Create Purchase Order (Select Supplier & Items)
    System-->>Gudang: PO Created (Status: PENDING)

    %% Step 2: Approval
    Admin->>System: View "Konfirmasi PO"
    Admin->>System: Approve PO
    System-->>Admin: PO Status -> APPROVED

    %% Step 3: Receive Goods
    Note right of Gudang: Goods arrive at warehouse
    Gudang->>System: Input "Barang Masuk" (Link to PO)
    System->>System: Validate PO & Items
    System->>System: Increase Stock Level
    System->>System: Update PO Status (RECEIVED)
    System-->>Gudang: Success Message
```

---

## Flow 2: Project & Production

**Goal**: Deal with customer and manage vehicle production.

### Step-by-Step Guide

1.  **Create Project / Deal**:
    - Go to **Project & Estimasi**.
    - Click **"Buat Penawaran Baru"**.
    - Select Customer and input details (Description, Qty, Price).
    - **Smart Planning**: Input vehicle dimensions (L x W x H) to get material estimates.
    - Set status to `DEAL` when confirmed.
2.  **Inbound Vehicle (Kendaraan Masuk)**:
    - Go to **Manajemen Kendaraan > Form Kendaraan Masuk**.
    - Click **"Kendaraan Masuk"**.
    - Input vehicle details (Plate No, Brand).
    - **Link Project**: Select the Project/SPK created in Step 1.
    - Check typical defects/missing parts in the checklist.
3.  **Material Usage (Produksi)**:
    - Go to **Manajemen Barang > Barang Keluar**.
    - Click **"Catat Barang Keluar"**.
    - Select **Jenis: Produksi**.
    - Select the **Kendaraan** currently in production.
    - Add items used (e.g., Cat, Besi).
    - _System Action_: Stock decreases. Usage is recorded against the vehicle.

### Sequence Diagram (User Interaction)

```mermaid
sequenceDiagram
    actor Sales as Sales/Admin
    actor Produksi as Tim Produksi
    actor Customer as Customer
    participant System as Karoseri System

    %% Step 1: Deal
    Customer->>Sales: Request Order (e.g. 5 Units Wingbox)
    Sales->>System: Create Project "Wingbox Deal"
    Sales->>System: Input Specs (Dimensi) -> Get Material Est.
    System-->>Sales: Project Saved (Status: DEAL)

    %% Step 2: Inbound
    Customer->>Produksi: Deliver Chassis/Truck
    Produksi->>System: Input "Kendaraan Masuk"
    Produksi->>System: Link to Project "Wingbox Deal"
    System-->>Produksi: Vehicle Registered (Linked to Project)

    %% Step 3: Production
    Produksi->>System: Request Materials (Barang Keluar)
    System->>System: Deduct Inventory
    System->>System: Record Usage for Vehicle
```

---

## Flow 3: Quality Control & Delivery

**Goal**: Ensure quality and deliver vehicle to customer.

### Step-by-Step Guide

1.  **Finish Production**:
    - Ensure all work is done.
    - Update vehicle status to `SELESAI` (Currently manual or triggered by workflow).
2.  **Quality Control (QC)**:
    - Go to **Manajemen Kendaraan > Form Kendaraan Keluar**.
    - Find the vehicle. Click the **QC Checklist** icon.
    - Inspect all areas (Exterior, Interior, Safety).
    - Mark items as `Baik`, `Rusak`, or `Perlu Perbaikan`.
3.  **Generate Delivery Order (Surat Jalan)**:
    - In **Form Kendaraan Keluar**, click **"Kendaraan Keluar"**.
    - Input date.
    - **Validation**: You MUST check **"Layak Keluar"** (Pass QC).
    - If checked, the system generates a **Surat Jalan**.
    - If NOT checked (Failed QC), the system records the attempt but **blocks** the Surat Jalan.

### Sequence Diagram (User Interaction)

```mermaid
sequenceDiagram
    actor QC as QC Staff
    actor Admin as Admin
    participant System as Karoseri System

    %% Step 1: QC Inspection
    QC->>System: Open "Kendaraan Keluar" Page
    QC->>System: Perform Manual Inspection
    QC->>System: Fill QC Checklist (Exterior, Interior)

    %% Step 2: Delivery Process
    Admin->>System: Attempt "Kendaraan Keluar"

    alt QC Failed / Not Layak
        Admin->>System: Uncheck "Layak Keluar"
        System-->>Admin: Record Log (No Surat Jalan)
    else QC Passed / Layak
        Admin->>System: Check "Layak Keluar"
        System->>System: Generate Surat Jalan (PDF)
        System->>System: Update Vehicle Status -> KELUAR
        System-->>Admin: Show Success & Download Link
    end
```
