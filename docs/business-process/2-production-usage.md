# Alur Penggunaan Barang (Material Usage)

```mermaid
graph TD
    %% Actors
    Produksi["Unit Produksi"]
    Gudang["Unit Gudang"]
    System["Karoseri System"]

    Start(("Mulai")) --> RequestBarang["Permintaan Barang Keluar"]

    subgraph "Kategori Penggunaan"
        RequestBarang --> IdentifyType{"Jenis Penggunaan?"}

        %% Path 1: Usage for Vehicle
        IdentifyType -->|Produksi Kendaraan| SelectVehicle["Pilih Kendaraan / SPK"]
        SelectVehicle --> InputItem1["Input Barang & Qty"]
        InputItem1 --> CalcHPP["Hitung HPP Kendaraan"]
        CalcHPP --> RecordUsage1["Catat di Detail Kendaraan"]

        %% Path 2: Usage for Tools/Consumables
        IdentifyType -->|Alat / Habis Pakai| SelectTool["Pilih Kategori Alat"]
        SelectTool --> InputItem2["Input Barang & Qty"]
        InputItem2 --> GeneralCost["Catat Biaya Operasional"]
        GeneralCost --> NoVehicleDetail["Tidak Masuk Detail Kendaraan"]
    end

    RecordUsage1 --> DeductStock["Kurangi Stok Gudang"]
    NoVehicleDetail --> DeductStock

    DeductStock --> Alert{"Stok Minimum?"}
    Alert -->|Ya| NotifyPurchase["Notifikasi Restok"]
    Alert -->|Aman| EndUsage(("Selesai"))
    NotifyPurchase --> EndUsage

    %% Styling
    classDef action fill:#e8f5e9,stroke:#2e7d32,stroke-width:1px;
    classDef logic fill:#fff8e1,stroke:#ff8f00,stroke-width:1px;
    classDef system fill:#e3f2fd,stroke:#1565c0,stroke-width:1px;

    class RequestBarang,InputItem1,InputItem2,SelectVehicle,SelectTool action;
    class IdentifyType,Alert logic;
    class CalcHPP,RecordUsage1,GeneralCost,DeductStock,NotifyPurchase system;
```

## Penjelasan Alur

1.  **Identifikasi Penggunaan**: Barang keluar dibagi menjadi dua jalur utama.
    - **Produksi Kendaraan**: Untuk bahan baku yang menempel pada unit (misal: Plat, CNP, Cat untuk unit X). Ini **wajib** memilih Kendaraan tujuan agar biaya tercatat dalam HPP unit tersebut.
    - **Alat / Habis Pakai**: Untuk alat kerja (misal: Kawat Las, Gerinda, Sarung Tangan) yang sifatnya umum. Biaya ini masuk ke Biaya Operasional/Overhead dan **tidak** dibebankan spesifik ke satu unit kendaraan tertentu secara langsung.
2.  **Pencatatan**:
    - Material Kendaraan -> Muncul di "Detail Kendaraan" -> Akumulasi HPP.
    - Alat -> Tercatat sebagai pengeluaran gudang biasa.
3.  **Inventaris**: Kedua jalur akan mengurangi stok aktual di gudang.
