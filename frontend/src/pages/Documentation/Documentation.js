import { stringify } from "uuid";
import baseUrl from "../../utils/baseUrl";

const docs = {
    api: {
        name: 'iCommerce API',
        uri: `${baseUrl}/api`,
        routes: {}
    }
};

docs.api.routes.auth = {
    uri: '/auth',
    name: 'Authorization',
    responses: [
        {
            name: 'User',
            response: JSON.stringify({
                "id": "f648323b-ec59-43f7-8a17-c3b111a19423",
                "first_name": "User",
                "last_name": "Name",
                "birth_date": "1990-01-01T00:00:00.000Z",
                "email": "username@email.com",
                "phone": "07000000000",
                "subscribed": true,
                "cart": {
                    "id": "6b6864f2-9ebe-4380-bc95-4bc8110ff435",
                    "customer_id": "f648323b-ec59-43f7-8a17-c3b111a19423",
                    "date_created": "2022-05-07T03:33:00.145Z",
                    "date_edited": "2022-05-07T19:49:05.327Z",
                    "items": []
                },
                "saved": [],
                "shop": {
                    "id": "6d3ced93-17db-4305-864d-b8875607b71a",
                    "shop_name": "iCommerce",
                    "image_id": null,
                    "description": "Description of your shop",
                    "business_email": "icommerce@businessemail.com",
                    "business_phone": "07000000001",
                    "business_type": "individual"
                }
            }, null, 2)
        }
    ],
    routes: [
        {
            uri: '',
            method: {
                get: {
                    name: 'Restore user session',
                    description: 'Checks on the server to see if the current client is authorized, if true the client session is resored and user object received.'
                }
            }
            
        },
        {
            uri: '/login',
            method: {
                post: {
                    name: 'Login user',
                    description: 'Takes the email and password of a registered user, authenticates and starts a session if correct.',
                    body: {
                        type: 'application/json',
                        params: {
                            email: {
                                type: 'string',
                                required: true,
                                description: 'The email of a registered user.'
                            },
                            password: {
                                type: 'string',
                                required: true,
                                description: 'The password that corresponds to the email of a registered user.'
                            },
                        }
                    }
                }
            },
            
        },
        {
            uri: '/login/google',
            method: {
                get: {
                    name: 'Login user using Google API',
                    description: `Authenticates the user using the Google API. Automatically creates a user account if hasn't already been registered.`
                }
            }
        },
        {
            uri: '/login/facebook',
            method: {
                get: {
                    name: 'Login user using Facebook/Meta API',
                    description: `Authenticates the user using the Facebook/Meta API. Automatically creates a user account if hasn't already been registered.`
                }
            }
        },
        {
            uri: '/logout',
            method: {
                post: {
                    name: 'Logout user',
                    description: 'Logs the user out and ends the current session.'
                }
            }
        },
        {
            uri: '/register',
            method: {
                post: {
                    name: 'Register user',
                    description: 'Registers a user for a customer account.',
                    body: {
                        type: 'application/json',
                        params: {
                            first_name: {
                                type: 'string',
                                required: true,
                                description: 'First (given) name of the user.'
                            },
                            last_name: {
                                type: 'string',
                                required: true,
                                description: 'Last (family) name of the user.'
                            },
                            birth_date: {
                                type: 'date',
                                required: true,
                                description: 'The users date of birth.'
                            },
                            email: {
                                type: 'string',
                                required: true,
                                description: 'The email of the user.',
                                requirements: [
                                    'Must be submitted in correct email format'
                                ]
                            },
                            phone: {
                                type: 'string',
                                required: false,
                                description: 'Phone number of the user.'
                            },
                            password: {
                                type: 'string',
                                required: true,
                                description: 'Password for the user.',
                                requirements: [
                                    'Minimum length of 8 characters',
                                    'Minimum of 1 lowercase',
                                    'Minimum of 1 number',
                                    'Minimum of 1 special character'
                                ]
                            },
                            subscribed: {
                                type: 'boolean',
                                required: true,
                                description: 'Offers the user to subscribe to the newsletter.'
                            }
                        }
                    }
                }
            }
            
        },
        {
            uri: '/register/shop',
            method: {
                post: {
                    name: 'Register shop',
                    description: 'Registers the authenticated user for a seller/shop account. Please note that the user must already be logged in to use this route.',
                    body: {
                        type: 'application/json',
                        params: {
                            shop_name: {
                                type: 'string',
                                required: true,
                                description: 'The name of the shop or business.'
                            },
                            description: {
                                type: 'string',
                                required: true,
                                description: 'Description of the shop/business.'
                            },
                            business_email: {
                                type: 'date',
                                required: true,
                                description: 'The email of the buesiness account.',
                                requirements: [
                                    'Must be submitted in correct email format'
                                ]
                            },
                            business_phone: {
                                type: 'string',
                                required: false,
                                description: 'The phone number of the business.'
                            },
                            business_type: {
                                type: 'string',
                                required: false,
                                description: 'Type of shop account.',
                                default: 'individual',
                                options: [
                                    'individual',
                                    'company',
                                    'non_profit',
                                    'government_entity'
                                ]
                            }
                        }
                    }
                }
            }
        }
    ]
}

docs.api.routes.categories = {
    uri: '/categories',
    name: 'Categories',
    responses: [
        {
            name: 'Categories',
            response: JSON.stringify([
                {
                    "name": "Main Category 1",
                    "href": "/main-category-1",
                    "subCategories": [
                        {
                            "name": "Sub-category 1",
                            "href": "/sub-category1",
                            "subCategories": [
                                {
                                    "name": "Sub-sub-category 1",
                                    "href": "/sub-sub-category1",
                                    "subCategories": []
                                },
                            ]
                        }
                    ]
                }
            ], null, 2)
        }
    ],
    routes: [
        {
            uri: '/',
            method: {
                get: {
                    name: 'Get all categories',
                    description: 'Gets an object containing all categories and sub-categories.'
                }
            },
        },
        {
            uri: '/:href',
            method: {
                get: {
                    name: 'Get categories by href',
                    description: 'Gets a category or sub-category by href.',
                    params: {
                        href: {
                            description: 'HREF name of the category.'
                        }
                    }
                }
            }
            
        },
        {
            uri: '/main',
            method: {
                get: {
                    name: 'Get main categories',
                    description: 'Gets a list of all the main/top-level categories.'
                }
            }
        },
        {
            uri: '/:category',
            method: {
                get: {
                    name: 'Get sub-categories',
                    description: 'Gets a list of all the sub-categories by a category.',
                    params: {
                        category: {
                            description: 'The href of the category you want the subcategories from.'
                        }
                    }
                }
            }
            
        },
        {
            uri: '/:category/attributes',
            method: {
                get: {
                    name: 'Get attributes by category',
                    description: 'Gets a list of attributes for a specific category.',
                    params: {
                        category: {
                            description: 'The href of the category you want the attributes from.'
                        }
                    }
                }
            }
            
        }
    ]
}

docs.api.routes.checkout = {
    uri: '/checkout',
    name: 'Checkout',
    responses: [
        {
            name: 'Payment Intent',
            response: JSON.stringify({
                items: [
                    {
                        id: 'dab153d9-ef2d-4da6-80ee-4bcc52835f79',
                        product_id: '2c5a7178-6682-461f-9c62-f2de0539008c',
                        name: 'Name of the first item.',
                        description: 'Description of the first item.',
                        price: '£70.00',
                        in_stock: 49,
                        ordered: 35,
                        awards: null,
                        item_quantity: 1,
                        total: 70,
                        image: [Object],
                        seller: [Object]
                    }
                ],
                total: 73.99,
                paymentIntent: {
                    id: 'pi_3KxrRTAkn0ngdOV34v1GH6dA',
                    object: 'payment_intent',
                    amount: 7399,
                    amount_capturable: 0,
                    amount_details: { tip: {} },
                    amount_received: 0,
                    application: null,
                    application_fee_amount: null,
                    automatic_payment_methods: { enabled: true },
                    canceled_at: null,
                    cancellation_reason: null,
                    capture_method: 'automatic',
                    charges: {
                        object: 'list',
                        data: [],
                        has_more: false,
                        total_count: 0,
                        url: '/v1/charges?payment_intent=pi_3KxrRTAkn0ngdOV34v1GH6dA'
                    },
                    client_secret: 'pi_3KxrRTAkn0ngdOV34v1GH6dA_secret_I3gJWDOnztu6Y2wFEOlCG0bbH',    
                    confirmation_method: 'automatic',
                    created: 1652182887,
                    currency: 'gbp',
                    customer: null,
                    description: '{"order_id":"d045ff90-07c7-490a-9767-d351529cf631"}',
                    invoice: null,
                    last_payment_error: null,
                    livemode: false,
                    metadata: { order_id: 'd045ff90-07c7-490a-9767-d351529cf631' },
                    next_action: null,
                    on_behalf_of: null,
                    payment_method: null,
                    payment_method_options: { afterpay_clearpay: [Object], card: [Object], klarna: [Object] },
                    payment_method_types: [ 'card', 'afterpay_clearpay', 'klarna' ],
                    processing: null,
                    receipt_email: null,
                    review: null,
                    setup_future_usage: null,
                    shipping: null,
                    source: null,
                    statement_descriptor: null,
                    statement_descriptor_suffix: null,
                    status: 'requires_payment_method',
                    transfer_data: null,
                    transfer_group: 'd045ff90-07c7-490a-9767-d351529cf631'
                }
            }, null, 2)
        }
    ],
    routes: [
        {
            uri: '/intent',
            method: {
                post: {
                    name: 'Create payment intent',
                    description: 'Create a new payment intent for current cart/bag items and quantities. This returns an object with the array of items in the cart bag, the total amount to pay in the checkout and the payment intent generated by stripe.',
                    body: {
                        type: 'application/json',
                        params: {
                            items: {
                                type: 'array of objects',
                                required: true,
                                description: 'An array of items the customer would like to purchase.',
                                params: {
                                    item_id: {
                                        type: 'string/uuid',
                                        required: true,
                                        description: 'The ID of an item the customer would like to purchase.'
                                    },
                                    item_quantity: {
                                        type: 'number',
                                        required: true,
                                        decription: 'The number of item this item that the customer would like to purchase.'
                                    }
                                }
                            },
                            shipping: {
                                type: 'string',
                                required: true,
                                description: 'The customers choice of shipping.',
                                options: [
                                    'Next Day',
                                    'Standard',
                                    'Upto 7 Days'
                                ]

                            }
                        }
                    }
                }
            }
        },
        {
            uri: '/transfers/:orderId',
            method: {
                post: {
                    name: 'Complete order transfers',
                    description: 'Carries out the transfer from iCommerce to shop/seller when customer payment is complete and recieved.',
                    params: {
                        orderId: {
                            type: 'string/uuid',
                            description: `The ID of the order thats transfer needs fulfilling.`,
                            required: true
                        }
                    }
                }
            }
        }
    ]
}

docs.api.routes.customer = {
    uri: '/customer',
    name: 'Customer Actions',
    responses: [
        {
            name: 'Addresses',
            response: [
                JSON.stringify([
                    {
                        id: '117665e0-ca34-42dd-90b5-acf56951aec7',
                        line_1: '1 Address Line',
                        line_2: '',
                        city: 'Cityshire',
                        county: 'Countyshire',
                        postcode: 'C06 9BL',
                        is_primary: true,
                        customer_id: '9b080c4e-7d9e-4340-bc02-b0d890120627',
                        seller_id: null
                    }
                ], null, 2)
            ]
        },
        {
            name: 'Orders',
            response: JSON.stringify({
                orders: [
                    {
                        id: '821a47f2-7b6a-45f7-9ed6-950bdc97f2cf',
                        customer_id: '9b080c4e-7d9e-4340-bc02-b0d890120627',
                        date: '2021-04-27T19:31:55.074Z',
                        payment_complete: true,
                        postage_option: 'Next Day',
                        postage_price: '£3.99',
                        items: [
                            {
                                id: 'da6330f3-9324-42df-b0e8-9dbdaa41f19f',
                                order_id: '821a47f2-7b6a-45f7-9ed6-950bdc97f2cf',
                                item_quantity: 1,
                                dispatch_date: null,
                                delivery_date: null,
                                cancelled: false,
                                reviewed_item: false,
                                reviewed_seller: false,
                                reviewed_customer: false,
                                seller_paid: false,
                                transfer_id: null,
                                item_price: '£0.00',
                                seller: {
                                    id: '55c49c94-a9f6-4dbe-985c-cede294a181a',
                                    shop_name: 'iCommerce',
                                    image_id: null,
                                    description: 'The top place to come for your online shopping needs.',
                                    business_email: 'shop@icommerce.com',
                                    business_phone: '07000000001',
                                    business_type: 'individual',
                                    stripe_id: 'acct_5OgrgpRHzmNLFGl'
                                },
                                item: {
                                    id: 'dab153d9-ef2d-4da6-80ee-4bcc52835f79',
                                    product_id: '2c5a7178-6682-461f-9c62-f2de0539008c',
                                    name: '50" Samsung Television',
                                    description: 'The best television on the market.',
                                    price: '499.99',
                                    in_stock: 49,
                                    ordered: 35,
                                    awards: null,
                                    image: {
                                        id: 'd15fae8b-f5af-4263-a96c-2c43e1b0b079',
                                        name: '50"-samsung-television.png',
                                        src: 'data:image/png;base64,...',
                                        type: 'image/png'
                                      }
                                }
                            }
                        ],
                        delivery_address: {
                            id: '117665e0-ca34-42dd-90b5-acf56951aec7',
                            line_1: '1 Address Line',
                            line_2: '',
                            city: 'Cityshire',
                            county: 'Countyshire',
                            postcode: 'C06 9BL',
                            is_primary: true,
                            customer_id: '9b080c4e-7d9e-4340-bc02-b0d890120627',
                            seller_id: null
                        }
                    }
                ],
                years: [ 2022, 2021 ],
                count: 23
            }, null, 2)
        }
    ],
    routes: [
        {
            uri: '/:customerId/save-item/:itemId',
            method: {
                post: {
                    name: 'Add/remove saved item',
                    description: 'Add or remove from the list of the customers saved items.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer that would like to alter their saved items.',
                            required: true
                        },
                        itemId: {
                            type: 'string/uuid',
                            description: 'The ID of the item that the customer would like to add or remove from their saved items.',
                            required: true
                        }
                    },
                    queries: {
                        no_delete: {
                            type: 'boolean',
                            description: `Set to true if you don't require the item to be deleted from the saved items if it's already in there. For example when syncing saved items on login.`,
                            options: [
                                'true',
                                'false'
                            ],
                            default: 'false'
                        }
                    }
                }
            }
            
        },
        {
            uri: '/:customerId/cart/:cartId/:itemId',
            method: {
                post: {
                    name: 'Add item to cart/bag.',
                    description: 'Add an item to a registered customers cart/bag.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer that would like to add an item to their cart.',
                            required: true
                        },
                        cartId: {
                            type: 'string/uuid',
                            description: 'The ID of the customers cart to add an item to.',
                            required: true
                        },
                        itemId: {
                            type: 'string/uuid',
                            description: 'The ID of the item that the customer would like to add to their cart.',
                            required: true
                        }
                    },
                    queries: {
                        quantity: {
                            type: 'number',
                            description: 'The quantity of the items that the customer wishes to add to their cart/bag. Only required if you wish to add more than one item.',
                            default: '1'
                        },
                        no_update: {
                            type: 'boolean',
                            description: 'Set to true if you do not want the quantity to be updated if the added item is already in the bag. For example when syncing cart/bag items on login.',
                            options: [
                                'true',
                                'false'
                            ],
                            default: 'false'
                        }
                    }
                },
                put: {
                    name: 'Edit item in cart/bag',
                    description: 'Edit the quantity of an item in the cart/bag.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer that would like to update an item to their cart.',
                            required: true
                        },
                        cartId: {
                            type: 'string/uuid',
                            description: 'The ID of the customers cart to update an item from.',
                            required: true
                        },
                        itemId: {
                            type: 'string/uuid',
                            description: 'The ID of the item that the customer would like to update within their cart.',
                            required: true
                        }
                    },
                    queries: {
                        quantity: {
                            type: 'number',
                            description: 'The new quantity of the specified item.',
                            required: true
                        }
                    }
                },
                delete: {
                    name: 'Remove item from cart/bag',
                    description: 'Remove an item from the customers cart/bag.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer that would like to update an item to their cart.',
                            required: true
                        },
                        cartId: {
                            type: 'string/uuid',
                            description: 'The ID of the customers cart to update an item from.',
                            required: true
                        },
                        itemId: {
                            type: 'string/uuid',
                            description: 'The ID of the item that the customer would like to update within their cart.',
                            required: true
                        }
                    }
                }
            }
        },
        {
            uri: '/:customerId/addresses',
            method: {
                get: {
                    name: 'Get addresses',
                    description: 'Get the addresses of the specified user.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customers addresses to fetch.',
                            required: true
                        }
                    }
                },
                post: {
                    name: 'Create new address',
                    description: '',
                    body: {
                        type: 'application/json',
                        params: {
                            city: {
                                type: 'string',
                                description: 'The city or town for the address.',
                                required: true
                            }, 
                            county: {
                                type: 'string',
                                description: 'The county or state for the address.',
                                required: true
                            }, 
                            is_primary: {
                                type: 'boolean',
                                description: 'True if you would like this to be the customers primary address.'
                            },
                            line_1: {
                                type: 'string',
                                description: 'The first line of the customers address including the property number/name.',
                                required: true
                            },
                            line_2: {
                                type: 'string',
                                description: 'The second line of the customers address if applicable.'
                            },
                            postcode: {
                                type: 'string',
                                description: 'The potal or zip code for the customers address.',
                                required: true
                            }
                        }
                    },
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer creating an address.',
                            required: true
                        }
                    }
                }
            }
        },
        {
            uri: '/:customerId/orders',
            method: {
                get: {
                    name: 'Get customer orders',
                    description: 'Get orders for the specified customer.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer that is requesting their orders.',
                            required: true
                        }
                    },
                    queries: {
                        limit: {
                            type: 'number',
                            description: 'Returns the list with the specified amount of orders per page.',
                            default: 25,
                        },
                        page: {
                            type: 'number',
                            description: 'Returns the list with with results from the specified page. (If limit is 25 and page is 3 it returns a max of 25 results from the 50th result.',
                            default: 1,
                        },
                        search: {
                            type: 'string',
                            description: 'Returns orders with the specified term in an item name.'
                        },
                        year: {
                            type: 'number/string',
                            description: 'Returns the list with orders made in the specified year.'
                        }
                    }
                }
            }
            
        },
        {
            uri: '/:customerId/orders/:orderId',
            method: {
                get: {
                    name: 'Get customer order by ID',
                    description: 'Get a specific order specified for a specific customer.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customers requesting the order.',
                            required: true
                        },
                        orderId: {
                            type: 'string/uuid',
                            description: 'The ID of the order you would like to retrieve.',
                            required: true
                        }
                    }
                },
                post: {
                    name: 'Submit new order',
                    description: 'Submits and creates a new order.',
                    body: {
                        type: 'application/json',
                        params: {
                            deliveryAddressId: {
                                type: 'string/uuid',
                                description: 'The ID of the delivery address selected by the customer.',
                                required: true
                            },
                            postage: {
                                type: 'object',
                                description: 'An object containting the postage.option and the postage.price.',
                                required: true,
                                params: {
                                    option: {
                                        type: 'string',
                                        description: 'The price of the postage option at the time of sale.',
                                        required: true
                                    },
                                    price: {
                                        type: 'number',
                                        description: 'The postage option selected by the user.',
                                        required: true
                                    }
                                }
                            },
                            items: {
                                type: 'array',
                                description: 'An array of item objects the customer would like to purchase containing the item_id, item_price, item_quantity and seller_id',
                                required: true,
                                params: {
                                    item_id: {
                                        type: 'string/uuid',
                                        description: 'The ID of the item the customer would like to purchase.',
                                        required: true
                                    },
                                    item_price: {
                                        type: 'number',
                                        description: 'The price of the specified item at the time of sale.',
                                        required: true
                                    },
                                    item_quantity: {
                                        type: 'number',
                                        description: 'The quantity of the item that the customer would like to purchase.',
                                        required: true
                                    },
                                    seller_id: {
                                        type: 'string/uuid',
                                        description: 'The ID of the seller/shop that sells the item.',
                                        required: true
                                    }
                                }
                            },
                            cartId: {
                                type: 'string/uuid',
                                description: 'The ID of the cart/bag that the customer used to comeplete the sale.',
                                required: true
                            }
                        }
                    },
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer that is placing the order.',
                            required: true
                        },
                        orderId: {
                            type: 'string/uuid',
                            description: 'The ID of the order you would like to create. Use the "order_id" from the payment intent object.',
                            required: true
                        }
                    }
                },
                put: {
                    name: 'Confirm customer payment',
                    description: 'Used to confirm the order once payment has been made using stripe.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer thats payment is confirmed.',
                            required: true
                        },
                        orderId: {
                            type: 'string/uuid',
                            description: 'The ID of the order that the customer has paid for.',
                            required: true
                        }
                    }
                },
                delete: {
                    name: 'Cancel customer order',
                    description: 'Cancels all or part of a customer order. To cancel the whole order use the uri stated. Only allow the customer/client to use this before the order has been dispatched. If you would like to cancel an order only from one seller provide the seller_id in a query, if you would like to cancel a single items supply the order_item_id in the query.',
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer that is cancelling their order.',
                            required: true
                        },
                        orderId: {
                            type: 'string/uuid',
                            description: 'The ID of the order that the customer is cancelling.',
                            required: true
                        }
                    },
                    queries: {
                        order_item_id: {
                            type: 'string/uuid',
                            description: `The order item ID of the item the customer would like to cancel from the order. Do not confuse this with a regular item ID, the order item ID is supplied within the orders object. Only required to cancel a single item.`
                        },
                        seller_id: {
                            type: 'string/uuid',
                            description: 'The ID of the seller/shop the customer would like to cancel an order from. Only required to cancel an order from a seller.'
                        }
                    }
                }
            },
        },
        {
            uri: '/:customerId/review',
            method: {
                post: {
                    name: 'Submit review',
                    description: 'Submit either a seller or product review. To submit a product review the product ID is required in the body, to submit a seller review the seller ID is required in the body.',
                    body: {
                        type: 'application/json',
                        params: {
                            order_id: {
                                type: 'string/uuid',
                                description: 'The ID of the order that the customer is posting a review for.',
                                required: true
                            },
                            order_item_id: {
                                type: 'string/uuid',
                                description: 'The order item ID that is being reviewed.',
                                required: true
                            },
                            product_id: {
                                type: 'string/uuid',
                                description: 'The ID of the product that the customer is reviewing. Only required for a product review.'
                            },
                            seller_id: {
                                type: 'string/uuid',
                                description: 'The id of the seller that the customer is reviewing. Only required for a seller review.'
                            },
                            rating: {
                                type: 'number',
                                description: 'The rating that the customer gives either the product or the seller.',
                                required: true,
                                options: [
                                    1, 2, 3, 4, 5
                                ]
                            },
                            review: {
                                type: 'string',
                                description: 'The written review that the customer is giving the product or seller.',
                                required: true
                            }
                        }
                    },
                    params: {
                        customerId: {
                            type: 'string/uuid',
                            description: 'The ID of the customer that is posting the review.',
                            required: true
                        }
                    }
                }
            }
        }
    ]
}

docs.api.routes.products = {
    uri: '/products',
    name: 'Products and Items',
    routes: [
        {
            uri: '/items',
            method: {
                post: {
                    name: 'Get items from item list',
                    description: 'Get items to display in cart/bag and saved items by item ID.',
                    params: {}
                }
            }
        },
        {
            uri: '/items/:itemId',
            method: {
                post: {
                    name: 'Get item by ID',
                    description: 'Get a single item to by item ID.',
                    params: {}
                }
            }
        },
        {
            uri: '/product/:productId',
            method: {
                post: {
                    name: 'Get product by ID',
                    description: 'Get a product and its items by product ID.',
                    params: {}
                }
            }
        }
    ]
}

docs.api.routes.seller = {
    uri: '/seller',
    name: 'Seller/Shop Actions',
    routes: [
        {
            uri: '/:sellerId/products/:category',
            method: {
                post: {
                    name: 'Get sellers products by category',
                    description: 'Get a list of sellers products and their items by seller ID and category href (omit href for all products).',
                    params: {}
                }
            }
        },
        {
            uri: '/:sellerId/products',
            method: {
                post: {
                    name: 'Create a new product listing',
                    description: 'Creates a new listing for a sellers product and its items.',
                    params: {}
                }
            }
        },
        {
            uri: '/:sellerId/products/:productId',
            method: {
                post: {
                    name: 'Create product items',
                    description: 'Creates new items for an existing product.',
                    params: {}
                },
                put: {
                    name: 'Edit product items',
                    description: 'Edits the current items that are listed for an existing product',
                    params: {}
                }
            }
        },
        {
            uri: '/:sellerId/products/images',
            method: {
                delete: {
                    name: 'Purge unused images',
                    description: 'Deletes all unused product images from the database.',
                    params: {}
                }
            }
        },
        {
            uri: '/:sellerId/orders',
            method: {
                get: {
                    name: 'Get seller orders',
                    description: 'Get a list of all the sellers orders.',
                    params: {}
                }
            }
        },
        {
            uri: '/:sellerId/orders/:orderId',
            method: {
                get: {
                    name: 'Get seller order by ID',
                    description: 'Get a specific order by the order ID',
                    params: {}
                },
                put: {
                    name: 'Update seller order status',
                    description: 'Seller actions for updating the order (dispatched, delivered and reviewed).',
                    params: {}
                }
            }
        },
        {
            uri: '/:sellerId/review',
            method: {
                get: {
                    name: 'Post a customer review',
                    description: 'Create a customer review for an order.',
                    params: {}
                }
            }
        }
    ]
}

const contents = [];
for (const doc in docs) {
    contents.push(docs[doc]);
};

const api = [];
for (const route in docs.api.routes) {
    api.push(docs.api.routes[route]);
};

export { api, contents };
export default docs;