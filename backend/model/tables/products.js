require('dotenv').config();
const baseUrl = process.env.BASE_URL;

const products = [
    {
        id: '6dafd114-ae88-439a-afb1-09c4707b6ea1',
        product: ['6dafd114-ae88-439a-afb1-09c4707b6ea1', true],
        productCategories: ['Electronics', 'Sound & Vision', 'TVs'],
        items: [
            {
                id: 'eb8bb5ca-8914-416b-9a2b-2aa221a73a5a',
                item: ['eb8bb5ca-8914-416b-9a2b-2aa221a73a5a', '6dafd114-ae88-439a-afb1-09c4707b6ea1', 'TCL 32RS520K Roku 32" Smart HD Ready LED TV', 'Enjoy hours of entertainment with the TCL 32RS520K Roku 32" Smart HD Ready LED TV. You can stream from all your favourite platforms like Disney+, Prime Video or Netflix.', '£159.99', 10],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'TCL',
                    'screen-resolution': '720p',
                    'size_tv-monitor-screen': 32
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['43c641bd-328d-4319-90b3-0c9cb0d39f22', 'M10226908.jpeg', true],
                        ['90db2965-2a9d-4617-9d5a-8279ced8b5e4', 'M10226908_001.jpeg'], 
                        ['801da812-f87d-48c0-a855-01683e963b5c', 'M10226908_003.jpeg'], 
                        ['45bef771-ba8c-4b78-854a-72eac3538bd3', 'M10226908_005.jpeg'], 
                        ['736e930a-edd6-4638-bc49-29c787f335b8', 'M10226908_006.jpeg']
                    ]
                }
            },
            {
                id: '64ba2b6e-449f-42fd-80c3-ea9e69e757ca',
                item: ['64ba2b6e-449f-42fd-80c3-ea9e69e757ca', '6dafd114-ae88-439a-afb1-09c4707b6ea1', 'TCL 40RS520K Roku 40" Smart Full HD HDR LED TV', 'Enjoy hours of entertainment with the TCL 40RS520K Roku 40" Smart Full HD LED TV. You can stream from all your favourite platforms like Disney+, Prime Video or Netflix.', '£219.99', 6],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'TCL',
                    'screen-resolution': '1080p',
                    'size_tv-monitor-screen': 40
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['1c7b2e1c-e74f-454c-8a89-586b1329bb79', 'M10226908.jpeg', true],
                        ['9f70c3b4-23b3-4c9e-8a5d-428f2cf493ca', 'M10226908_001.jpeg'], 
                        ['532e786d-2e8f-4b43-b1b3-4b5b1dde27f4', 'M10226908_003.jpeg'], 
                        ['352b3c32-1810-45ac-96ea-bf8666cfea39', 'M10226908_005.jpeg'], 
                        ['a406e141-901b-443f-99ed-c36fb8c1b67b', 'M10226908_006.jpeg']
                    ]
                }
            }
        ]
    },
    {
        id: '55d026ac-ae17-4c4e-8d16-db4cbfadcfd3',
        product: ['55d026ac-ae17-4c4e-8d16-db4cbfadcfd3', true],
        productCategories: ['Electronics', 'Sound & Vision', 'TVs'],
        items: [
            {
                id: 'ac5be32b-190e-46c1-8caa-1c147770b64d',
                item: ['ac5be32b-190e-46c1-8caa-1c147770b64d', '55d026ac-ae17-4c4e-8d16-db4cbfadcfd3', 'SAMSUNG UE43AU7100KXXU 43" Smart 4K Ultra HD HDR LED TV', `Enjoy all the content you love in the best possible resolution on the Samsung UE43AU7100KXXU 43" Smart 4K Ultra HD HDR LED TV. The Crystal 4K Processor upscales what you're watching to give you the best 4K picture.`, '£329.00', 8],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Samsung',
                    'screen-resolution': '4K',
                    'size_tv-monitor-screen': 43
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['65af54da-3fd0-441b-98e6-ca301a3677b0', 'M10222287.jpeg', true],
                        ['5748e6ab-7b73-4341-9dae-7bbbb76bb961', 'M10222287_001.jpeg'], 
                        ['9c15c09a-05ea-421d-9792-cc15e32aadaf', 'M10222287_003.jpeg'], 
                        ['8db9b505-1e76-44e7-b1ed-9b38b064c4b3', 'M10222287_008.jpeg'],
                        ['6161969c-fff3-413d-bcf5-7cfbffa2b34a', 'M10222287_015.jpeg'],
                        ['3b52bf94-53e0-4370-ae82-0656d7168a08', 'M10222287_019.jpeg']
                    ]
                }
            },
            {
                id: 'f559c6c3-d2b7-4529-85c3-8fd6db0d9c40',
                item: ['f559c6c3-d2b7-4529-85c3-8fd6db0d9c40', '55d026ac-ae17-4c4e-8d16-db4cbfadcfd3', 'SAMSUNG UE50AU7100KXXU 50" Smart 4K Ultra HD HDR LED TV', `Enjoy all the content you love in the best possible resolution on the Samsung UE50AU7100KXXU 50" Smart 4K Ultra HD HDR LED TV. The Crystal 4K Processor upscales what you're watching to give you the best 4K picture.`, '£399.00', 8],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Samsung',
                    'screen-resolution': '4K',
                    'size_tv-monitor-screen': 50
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['e1f1cdf0-1f65-489f-b0bc-4a0a4493494b', 'M10222287.jpeg', true],
                        ['01e17763-7014-4133-b07e-e616a952e23d', 'M10222287_001.jpeg'], 
                        ['3894acdf-6eaf-4fae-bf9a-d4e427a217e4', 'M10222287_003.jpeg'], 
                        ['bfa28c49-a397-4771-b4a5-de1b4836d4d5', 'M10222287_008.jpeg'],
                        ['28a5e246-5512-4107-bac6-5eecc9ec6d90', 'M10222287_015.jpeg'],
                        ['44d17399-bc5a-4152-acc1-5e058592bdcc', 'M10222287_019.jpeg']
                    ]
                }
            },
            {
                id: '598b5302-1d83-47d7-8b1a-26903109c550',
                item: ['598b5302-1d83-47d7-8b1a-26903109c550', '55d026ac-ae17-4c4e-8d16-db4cbfadcfd3', 'SAMSUNG UE55AU7100KXXU 55" Smart 4K Ultra HD HDR LED TV', `Enjoy all the content you love in the best possible resolution on the Samsung UE55AU7100KXXU 55" Smart 4K Ultra HD HDR LED TV. The Crystal 4K Processor upscales what you're watching to give you the best 4K picture.`, '£449.00', 5],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Samsung',
                    'screen-resolution': '4K',
                    'size_tv-monitor-screen': 55
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['9c061bd9-a72d-4756-a471-38a34c3528d7', 'M10222287.jpeg', true],
                        ['0858aa4a-60a5-422a-9436-437a9eda2e55', 'M10222287_001.jpeg'], 
                        ['22b10495-0e7f-47c1-ba81-dd96b6ad86e4', 'M10222287_003.jpeg'], 
                        ['76e03f41-d4df-4fa6-a563-a1bc8da1490f', 'M10222287_008.jpeg'],
                        ['e1b35977-1883-49a7-a162-8f14ae09c260', 'M10222287_015.jpeg'],
                        ['0026c6a3-1c3e-45dd-aab6-b282b051cab7', 'M10222287_019.jpeg']
                    ]
                }
            },
            {
                id: 'ac5c959d-682d-4d36-887f-87cd93867317',
                item: ['ac5c959d-682d-4d36-887f-87cd93867317', '55d026ac-ae17-4c4e-8d16-db4cbfadcfd3', 'SAMSUNG UE58AU7100KXXU 58" Smart 4K Ultra HD HDR LED TV', `Enjoy all the content you love in the best possible resolution on the Samsung UE58AU7100KXXU 58" Smart 4K Ultra HD HDR LED TV. The Crystal 4K Processor upscales what you're watching to give you the best 4K picture.`, '£519.00', 4],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Samsung',
                    'screen-resolution': '4K',
                    'size_tv-monitor-screen': 58
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['82ff2a44-4465-48f6-85ea-8fe59ffd30ea', 'M10222287.jpeg', true],
                        ['e8b583dd-8b03-4267-a291-4b16d4aa9458', 'M10222287_001.jpeg'], 
                        ['abb41f0a-0133-482f-8cae-c7e0d02f361e', 'M10222287_003.jpeg'], 
                        ['c850e6ec-e3c9-4066-9826-13f57239736a', 'M10222287_008.jpeg'],
                        ['dd003bd6-c662-4817-9183-244d992c48fd', 'M10222287_015.jpeg'],
                        ['5fe4dae2-6406-42bb-bc35-404d64b06588', 'M10222287_019.jpeg']
                    ]
                }
            },
            {
                id: '7659abc1-6a2c-4ba7-8eaf-e1dee83676f2',
                item: ['7659abc1-6a2c-4ba7-8eaf-e1dee83676f2', '55d026ac-ae17-4c4e-8d16-db4cbfadcfd3', 'SAMSUNG UE65AU7100KXXU 65" Smart 4K Ultra HD HDR LED TV', `Enjoy all the content you love in the best possible resolution on the Samsung UE65AU7100KXXU 65" Smart 4K Ultra HD HDR LED TV. The Crystal 4K Processor upscales what you're watching to give you the best 4K picture.`, '569.00', 5],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Samsung',
                    'screen-resolution': '4K',
                    'size_tv-monitor-screen': 65
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['b6cc02c5-5473-451f-a9a4-5f722924b178', 'M10222287.jpeg', true],
                        ['ce8ec413-5d10-458e-a2a9-519bd6aad504', 'M10222287_001.jpeg'], 
                        ['40e33c20-f7dd-4f17-8b34-55299c0ba8c6', 'M10222287_003.jpeg'], 
                        ['78bea3cd-ae99-4284-a169-02fe17fabe21', 'M10222287_008.jpeg'],
                        ['2f7d5343-92e6-4432-91fa-c3d46a527fe5', 'M10222287_015.jpeg'],
                        ['773aa675-d820-43f5-8aac-8012d2a052b1', 'M10222287_019.jpeg']
                    ]
                }
            },
            {
                id: 'ae95d67f-0cee-41d7-8847-1100f391543f',
                item: ['ae95d67f-0cee-41d7-8847-1100f391543f', '55d026ac-ae17-4c4e-8d16-db4cbfadcfd3', 'SAMSUNG UE75AU7100KXXU 75" Smart 4K Ultra HD HDR LED TV', `Enjoy all the content you love in the best possible resolution on the Samsung UE75AU7100KXXU 75" Smart 4K Ultra HD HDR LED TV. The Crystal 4K Processor upscales what you're watching to give you the best 4K picture.`, '799.00', 5],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Samsung',
                    'screen-resolution': '4K',
                    'size_tv-monitor-screen': 75
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['69f7553c-0af8-4ba0-8b80-c65ba34ec1aa', 'M10222287.jpeg', true],
                        ['a3a84385-a638-4f11-8d93-915316949c51', 'M10222287_001.jpeg'], 
                        ['2d6280c3-0b5e-43c0-85c0-c6c04239883c', 'M10222287_003.jpeg'], 
                        ['57e4543f-c9fd-42f6-bda9-bed3fef2437d', 'M10222287_008.jpeg'],
                        ['36f887b9-f78f-422d-a7f1-f81b386dc19b', 'M10222287_015.jpeg'],
                        ['1404f030-d566-452a-b887-88c133718a37', 'M10222287_019.jpeg']
                    ]
                }
            },
            {
                id: 'b0884ab5-8a39-4f88-a23c-43fbb0faf609',
                item: ['b0884ab5-8a39-4f88-a23c-43fbb0faf609', '55d026ac-ae17-4c4e-8d16-db4cbfadcfd3', 'SAMSUNG UE85AU7100KXXU 85" Smart 4K Ultra HD HDR LED TV', `Enjoy all the content you love in the best possible resolution on the Samsung UE85AU7100KXXU 85" Smart 4K Ultra HD HDR LED TV. The Crystal 4K Processor upscales what you're watching to give you the best 4K picture.`, '1299.00', 4],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Samsung',
                    'screen-resolution': '4K',
                    'size_tv-monitor-screen': 85
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['36d58bec-a020-42bc-814f-b589e599f333', 'M10222287.jpeg', true],
                        ['cb22b6ab-cfd2-4954-8b60-0edd3f7d81e9', 'M10222287_001.jpeg'], 
                        ['ec68fa2e-f266-41bd-beb7-3abbe51d8540', 'M10222287_003.jpeg'], 
                        ['ebcad477-c97c-47e7-b3e2-19589933bab0', 'M10222287_008.jpeg'],
                        ['f8263b80-1401-43a8-a23a-a1294f769114', 'M10222287_015.jpeg'],
                        ['eb7241e2-81f1-4c20-abf7-d351d1f97b5c', 'M10222287_019.jpeg']
                    ]
                }
            }
        ]
    },
    {
        id: 'f7771a9b-774c-46bb-ae3c-e673154e5cab',
        product: ['f7771a9b-774c-46bb-ae3c-e673154e5cab', true],
        productCategories: ['Electronics', 'Sound & Vision', 'TVs'],
        items: [
            {
                id: '8e8f064d-c15d-4f4b-8168-c8ad3c7aa408',
                item: ['8e8f064d-c15d-4f4b-8168-c8ad3c7aa408', 'f7771a9b-774c-46bb-ae3c-e673154e5cab', 'PHILIPS 50PUS7556/12 50" 4K Ultra HD HDR LED TV', 'Enjoy films and shows in 4K Ultra HD resolution on the Philips 50PUS7556 50" 4K Ultra HD HDR LED TV. It offers rich colour and deep contrast, so everything looks vivid and lifelike.', '£359.99', 9],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Philips',
                    'screen-resolution': '4K',
                    'size_tv-monitor-screen': 50
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['bfb6ad28-6a59-4286-9891-96febef9092d', '10225066.jpeg', true],
                        ['b642df95-cf71-4e35-864d-ce73fe31977b', '10225066_014.jpeg'], 
                        ['820dccdc-9233-4d1b-a3db-8d069b00c304', '10225066_018.jpeg'], 
                        ['708d286c-fd87-47a0-b1e1-1b43bd40ff39', '10225066_019.jpeg'], 
                        ['4651dade-ba03-43fc-9397-ebbd4bfef46e', '10225066_120.jpeg']
                    ]
                }
            }
        ]
        
    },
    {
        id: '17a9f396-5f16-4665-988c-85566be20d8c',
        product: ['17a9f396-5f16-4665-988c-85566be20d8c', true],
        productCategories: ['Electronics', 'Game Consoles', 'Video Game Consoles'],
        items: [
            {
                id: '5dd48e3a-c97f-4251-a746-6afeda85ff33',
                item: ['5dd48e3a-c97f-4251-a746-6afeda85ff33', '17a9f396-5f16-4665-988c-85566be20d8c', 'MICROSOFT Xbox Series X, Seagate 1 TB Expansion Hard Drive & 3 Month Game Pass Ultimate Bundle', `Featuring re-engineered hardware and software integration, Xbox Velocity Architecture delivers superior speed and performance like you've never seen before. Ready for 8K gaming with speeds up to 120 fps, you'll experience lightning-fast gaming with incredible detail.`, '£679.00', 15],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Microsoft',
                    'game-console': 'Xbox Series X',
                    'hard-drive': '1TB',
                    'screen-resolution': '8K',
                    memory: '16GB'
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['f46efce9-c077-44d0-951b-75bb833878cc', '10231438.jpeg', true],
                        ['01fdf426-9791-45c1-a6d3-70ba3d24b190', '10231438_001.jpeg'], 
                        ['4a891ded-e8c9-4cea-bc27-024d3d90d058', '10231438_004.jpeg'], 
                        ['0c1b12d0-ba6d-49b1-9ed6-c05723f2a813', '10231438_008.jpeg'], 
                        ['7bcee706-271b-4d36-9cba-cee28081d18a', '10231438_010.jpeg']
                    ]
                }
            },
            {
                id: 'cb274b69-b213-46ec-808d-c20a18124c5c',
                item: ['cb274b69-b213-46ec-808d-c20a18124c5c', '17a9f396-5f16-4665-988c-85566be20d8c', 'MICROSOFT Xbox Series X, 3 Months Game Pass Ultimate, Razer Halo Infinite Edition Mouse & Keyboard Bundle', `Featuring re-engineered hardware and software integration, Xbox Velocity Architecture delivers superior speed and performance like you've never seen before. Ready for 8K gaming with speeds up to 120 fps, you'll experience lightning-fast gaming with incredible detail.`, '£679.00', 15],
                attributes: {
                    condition: 'New',
                    brand_electronics: 'Microsoft',
                    'game-console': 'Xbox Series X',
                    'hard-drive': '1TB',
                    'screen-resolution': '8K',
                    memory: '16GB'
                },
                images: {
                    url: `${baseUrl}/images/products/`,
                    names: [
                        ['301d8835-7839-4045-9dd9-d2385015efe9', '10233847.jpeg', true],
                        ['c05e6196-37dc-4d69-8413-ebb3225c1bdd', '10231438_001.jpeg'], 
                        ['6a3a67f5-05df-45e1-882f-adc14885f8a6', '10231438_004.jpeg'], 
                        ['8e9389a2-4df6-4ba8-bdcf-ed3ab3b26ce3', '10231438_008.jpeg'], 
                        ['f93caf54-a889-4dcd-bf11-096462d9e602', '10231438_010.jpeg']
                    ]
                }
            },
        ]
    }
]

module.exports = products;