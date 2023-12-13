/* eslint-disable max-len */
/* eslint-disable @cspell/spellchecker */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
import { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
const axiosGetMock: AxiosResponse = {
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: {} as AxiosRequestHeaders,
  } as InternalAxiosRequestConfig<any>,
  request: {},
  data: {
    items: [
      {
        type: 'entry_published',
        event_at: '2017-11-23T00:00:000Z',
        content_type_uid: 'Blog',
        data: {
          uid: '1',
          locale: 'en-us',
          title: 'My First Blog',
        },
      },
      {
        type: 'asset_published',
        event_at: '2017-11-22T22:59:000Z',
        content_type_uid: 'Blog',
        data: {
          uid: '3',
          locale: 'en-us',
          title: 'My Third Blog Image',
          filename: 'Blog3.jpg',
        },
      },
    ],
    skip: 100,
    limit: 100,
    total_count: 300,
  },
};

const assetQueryFindResponseDataMock = {
  "assets": [
    {
      "uid": "blt41cb1c94d363d824",
      "created_at": "2019-08-16T08:05:32.556Z",
      "updated_at": "2019-08-16T08:05:32.556Z",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "bltcd82b2c6bf913241",
      "content_type": "image/png",
      "file_size": "3780",
      "tags": [],
      "filename": "Samsung_Logo.png",
      "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/blt41cb1c94d363d824/5d5663cc34d39437c37c537e/Samsung_Logo.png",
      "ACL": {
        "roles": [],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "is_dir": false,
      "_version": 1,
      "title": "Samsung_Logo.png",
      "dimension": {
        "height": 30.223,
        "width": 91.026
      },
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-19T12:28:47.432Z",
        "user": "blt587a89fc7883c56700a95bfe"
      }
    },
    {
      "uid": "bltaf7230686bd6513c",
      "created_at": "2019-08-16T08:05:32.537Z",
      "updated_at": "2019-08-16T08:05:32.537Z",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "bltcd82b2c6bf913241",
      "content_type": "image/png",
      "file_size": "1537",
      "tags": [],
      "filename": "android-128.png",
      "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/bltaf7230686bd6513c/5d5663ccd1312137ca910e00/android-128.png",
      "ACL": {
        "roles": [],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "is_dir": false,
      "_version": 1,
      "title": "android-128.png",
      "dimension": {
        "height": 128,
        "width": 128
      },
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-19T12:28:47.432Z",
        "user": "blt587a89fc7883c56700a95bfe"
      }
    },
    {
      "uid": "blt19c34e5374418484",
      "created_at": "2019-08-16T08:05:30.460Z",
      "updated_at": "2019-08-16T08:05:30.460Z",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "bltcd82b2c6bf913241",
      "content_type": "image/jpeg",
      "file_size": "69609",
      "tags": [],
      "filename": "in-galaxy-note-5-n9208-sm-n9208zdvins-000000003-back-gold.jpg",
      "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/blt19c34e5374418484/5d5663ca9e9032233cab321a/in-galaxy-note-5-n9208-sm-n9208zdvins-000000003-back-gold.jpg",
      "ACL": {
        "roles": [],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "is_dir": false,
      "_version": 1,
      "title": "in-galaxy-note-5-n9208-sm-n9208zdvins-000000003-back-gold.jpg",
      "dimension": {
        "height": 615,
        "width": 802
      },
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-19T12:28:47.432Z",
        "user": "blt587a89fc7883c56700a95bfe"
      }
    },
    {
      "uid": "blt6045a4b8db103c2b",
      "created_at": "2019-08-16T08:05:30.173Z",
      "updated_at": "2019-08-16T08:05:30.173Z",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "bltcd82b2c6bf913241",
      "content_type": "image/png",
      "file_size": "2185",
      "tags": [],
      "filename": "download.png",
      "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/blt6045a4b8db103c2b/5d5663ca1a1b7e3885350f53/download.png",
      "ACL": {
        "roles": [],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "is_dir": false,
      "_version": 1,
      "title": "download.png",
      "dimension": {
        "height": 225,
        "width": 225
      },
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-19T12:28:47.432Z",
        "user": "blt587a89fc7883c56700a95bfe"
      }
    },
    {
      "uid": "bltb7851ab3713053d0",
      "created_at": "2019-08-16T08:05:27.890Z",
      "updated_at": "2019-08-16T08:05:27.890Z",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "bltcd82b2c6bf913241",
      "content_type": "image/png",
      "file_size": "1546",
      "tags": [],
      "filename": "Samsung_Logo.png",
      "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/bltb7851ab3713053d0/5d5663c7cb96683648a7967b/Samsung_Logo.png",
      "ACL": {
        "roles": [],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "is_dir": false,
      "_version": 1,
      "title": "Samsung_Logo.png",
      "dimension": {
        "height": 30,
        "width": 91
      },
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-19T12:28:47.432Z",
        "user": "blt587a89fc7883c56700a95bfe"
      }
    },
    {
      "uid": "blt9c3dff6e3151d374",
      "created_at": "2019-08-16T08:05:27.886Z",
      "updated_at": "2019-08-16T08:05:27.886Z",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "bltcd82b2c6bf913241",
      "content_type": "image/jpeg",
      "file_size": "5275",
      "tags": [],
      "filename": "download.jpg",
      "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/blt9c3dff6e3151d374/5d5663c79722fb38d7db52e5/download.jpg",
      "ACL": {
        "roles": [],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "is_dir": false,
      "_version": 1,
      "title": "download.jpg",
      "dimension": {
        "height": 259,
        "width": 194
      },
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-19T12:28:47.432Z",
        "user": "blt587a89fc7883c56700a95bfe"
      }
    },
  ]
}

const contentTypeQueryFindResponseDataMock = {
  "content_types": [
    {
      "created_at": "2019-08-16T08:18:56.914Z",
      "updated_at": "2019-08-16T08:18:58.736Z",
      "title": "Product",
      "uid": "product",
      "_version": 2,
      "inbuilt_class": false,
      "schema": [
        {
          "display_name": "Title",
          "uid": "title",
          "data_type": "text",
          "mandatory": false,
          "unique": false,
          "field_metadata": {
            "_default": true,
            "instruction": "Product Name",
            "version": 3
          },
          "multiple": false,
          "non_localizable": false
        },
        {
          "display_name": "URL",
          "uid": "url",
          "data_type": "text",
          "mandatory": false,
          "field_metadata": {
            "_default": true,
            "version": 3
          },
          "multiple": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "text",
          "display_name": "Description",
          "uid": "description",
          "field_metadata": {
            "allow_rich_text": true,
            "description": "",
            "multiline": false,
            "rich_text_type": "advanced",
            "version": 3
          },
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "number",
          "display_name": "Size (in GB)",
          "uid": "size",
          "field_metadata": {
            "description": "",
            "default_value": ""
          },
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "text",
          "display_name": "Color",
          "uid": "color",
          "field_metadata": {
            "description": "",
            "default_value": "",
            "version": 3
          },
          "format": "",
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "file",
          "display_name": "Images",
          "uid": "images",
          "field_metadata": {
            "description": "",
            "rich_text_type": "standard",
            "image": true
          },
          "multiple": true,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "reference",
          "display_name": "Categories",
          "reference_to": [
            "category"
          ],
          "field_metadata": {
            "ref_multiple": true,
            "ref_multiple_content_types": true
          },
          "uid": "categories",
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "number",
          "display_name": "Price in USD",
          "uid": "price_in_usd",
          "field_metadata": {
            "description": "",
            "default_value": ""
          },
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "reference",
          "display_name": "Brand",
          "reference_to": [
            "brand"
          ],
          "field_metadata": {
            "ref_multiple": false,
            "ref_multiple_content_types": true
          },
          "uid": "brand",
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "isodate",
          "display_name": "Launch Date",
          "uid": "launch_date",
          "field_metadata": {
            "description": "",
            "default_value": ""
          },
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "endDate": null,
          "startDate": null,
          "non_localizable": false
        },
        {
          "data_type": "boolean",
          "display_name": "instock",
          "uid": "instock",
          "field_metadata": {
            "description": "",
            "default_value": ""
          },
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "blocks",
          "display_name": "Additional Info",
          "blocks": [
            {
              "title": "Related Products",
              "uid": "related_products",
              "schema": [
                {
                  "data_type": "reference",
                  "display_name": "Products",
                  "reference_to": [
                    "product"
                  ],
                  "field_metadata": {
                    "ref_multiple": true,
                    "ref_multiple_content_types": true
                  },
                  "uid": "products",
                  "mandatory": false,
                  "multiple": false,
                  "unique": false,
                  "non_localizable": false
                }
              ]
            },
            {
              "title": "Rating",
              "uid": "rating",
              "schema": [
                {
                  "data_type": "number",
                  "display_name": "Stars",
                  "display_type": "dropdown",
                  "enum": {
                    "advanced": false,
                    "choices": [
                      {
                        "value": 1
                      },
                      {
                        "value": 2
                      },
                      {
                        "value": 3
                      },
                      {
                        "value": 4
                      },
                      {
                        "value": 5
                      }
                    ]
                  },
                  "multiple": false,
                  "uid": "stars",
                  "field_metadata": {
                    "description": "",
                    "default_value": ""
                  },
                  "min_instance": null,
                  "max_instance": null,
                  "mandatory": false,
                  "unique": false,
                  "non_localizable": false
                }
              ]
            },
            {
              "title": "Deals",
              "uid": "deals",
              "schema": [
                {
                  "data_type": "text",
                  "display_name": "Deal Name",
                  "display_type": "dropdown",
                  "enum": {
                    "advanced": false,
                    "choices": [
                      {
                        "value": "Summer Deal"
                      },
                      {
                        "value": "Independence Day Deal"
                      },
                      {
                        "value": "Black Friday Deal"
                      },
                      {
                        "value": "Christmas Deal"
                      },
                      {
                        "value": "Deals of the Day"
                      }
                    ]
                  },
                  "multiple": false,
                  "uid": "deal_name",
                  "field_metadata": {
                    "description": "",
                    "default_value": "",
                    "version": 3
                  },
                  "min_instance": null,
                  "max_instance": null,
                  "mandatory": false,
                  "unique": false,
                  "non_localizable": false
                },
                {
                  "data_type": "text",
                  "display_name": "Deal Details",
                  "uid": "deal_details",
                  "field_metadata": {
                    "description": "",
                    "default_value": "",
                    "multiline": true,
                    "version": 3
                  },
                  "format": "",
                  "error_messages": {
                    "format": ""
                  },
                  "multiple": false,
                  "mandatory": false,
                  "unique": false,
                  "non_localizable": false
                }
              ]
            }
          ],
          "multiple": true,
          "uid": "additional_info",
          "field_metadata": {},
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "group",
          "display_name": "Bank Offers",
          "field_metadata": {},
          "schema": [
            {
              "data_type": "reference",
              "display_name": "Bank",
              "reference_to": [
                "bank"
              ],
              "field_metadata": {
                "ref_multiple": false,
                "ref_multiple_content_types": true
              },
              "uid": "bank",
              "multiple": false,
              "mandatory": false,
              "unique": false,
              "non_localizable": false
            },
            {
              "data_type": "text",
              "display_name": "Card Type",
              "display_type": "dropdown",
              "enum": {
                "advanced": false,
                "choices": [
                  {
                    "value": "Credit Card"
                  },
                  {
                    "value": "Debit Card"
                  }
                ]
              },
              "multiple": true,
              "uid": "card_type",
              "field_metadata": {
                "description": "",
                "default_value": "",
                "version": 3
              },
              "mandatory": false,
              "unique": false,
              "non_localizable": false
            },
            {
              "data_type": "number",
              "display_name": "Discount In Percentage",
              "uid": "discount_in_percentage",
              "field_metadata": {
                "description": "",
                "default_value": ""
              },
              "multiple": false,
              "mandatory": false,
              "unique": false,
              "non_localizable": false
            }
          ],
          "uid": "bank_offers",
          "multiple": true,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        }
      ],
      "last_activity": {
        "environments": [
          {
            "uid": "blta39a4441696e35e0",
            "details": [
              {
                "locale": "en-us",
                "time": "2019-08-23T13:02:25.439Z"
              }
            ]
          }
        ]
      },
      "maintain_revisions": true,
      "description": "",
      "DEFAULT_ACL": {
        "others": {
          "read": false,
          "create": false
        },
        "users": [
          {
            "uid": "bltb7dc5be19ed72dd9",
            "read": true,
            "sub_acl": {
              "read": true
            }
          }
        ]
      },
      "SYS_ACL": {
        "roles": [
          {
            "uid": "blt70c41dfd00924e9f",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            },
            "update": true,
            "delete": true
          },
          {
            "uid": "blt954756afc76573d1",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            },
            "update": true,
            "delete": true
          },
          {
            "uid": "blt5c82a78624ed860d",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            }
          }
        ],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "options": {
        "is_page": true,
        "singleton": false,
        "title": "title",
        "sub_title": [],
        "url_pattern": "/:title",
        "url_prefix": "/mobiles/"
      },
      "abilities": {
        "get_one_object": true,
        "get_all_objects": true,
        "create_object": true,
        "update_object": true,
        "delete_object": true,
        "delete_all_objects": true
      }
    },
    {
      "created_at": "2019-08-22T13:56:44.435Z",
      "updated_at": "2019-08-22T13:57:28.865Z",
      "title": "For Synchronization Calls",
      "uid": "for_synchronization_calls",
      "_version": 3,
      "inbuilt_class": false,
      "schema": [
        {
          "display_name": "Title",
          "uid": "title",
          "data_type": "text",
          "mandatory": true,
          "unique": true,
          "field_metadata": {
            "_default": true,
            "version": 3
          },
          "multiple": false,
          "non_localizable": false
        },
        {
          "display_name": "URL",
          "uid": "url",
          "data_type": "text",
          "mandatory": false,
          "field_metadata": {
            "_default": true,
            "version": 3
          },
          "multiple": false,
          "unique": false,
          "non_localizable": false
        },
        {
          "data_type": "text",
          "display_name": "Single line textbox",
          "uid": "single_line",
          "field_metadata": {
            "description": "",
            "default_value": "",
            "version": 3
          },
          "format": "",
          "error_messages": {
            "format": ""
          },
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        }
      ],
      "last_activity": {},
      "maintain_revisions": true,
      "description": "",
      "DEFAULT_ACL": {
        "others": {
          "read": false,
          "create": false
        },
        "users": [
          {
            "uid": "bltb7dc5be19ed72dd9",
            "read": true,
            "sub_acl": {
              "read": true
            }
          }
        ]
      },
      "SYS_ACL": {
        "roles": [
          {
            "uid": "blt70c41dfd00924e9f",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            },
            "update": true,
            "delete": true
          },
          {
            "uid": "blt954756afc76573d1",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            },
            "update": true,
            "delete": true
          },
          {
            "uid": "blt5c82a78624ed860d",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            }
          }
        ],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "options": {
        "is_page": true,
        "singleton": false,
        "title": "title",
        "sub_title": [],
        "url_pattern": "/:title",
        "url_prefix": "/"
      },
      "abilities": {
        "get_one_object": true,
        "get_all_objects": true,
        "create_object": true,
        "update_object": true,
        "delete_object": true,
        "delete_all_objects": true
      }
    },
    {
      "created_at": "2019-08-16T08:18:55.166Z",
      "updated_at": "2019-08-16T08:18:58.680Z",
      "title": "Category",
      "uid": "category",
      "_version": 2,
      "inbuilt_class": false,
      "schema": [
        {
          "display_name": "Title",
          "uid": "title",
          "data_type": "text",
          "mandatory": false,
          "unique": false,
          "field_metadata": {
            "_default": true,
            "instruction": "Category Name",
            "version": 3
          },
          "multiple": false,
          "non_localizable": false
        },
        {
          "data_type": "text",
          "display_name": "Description",
          "uid": "description",
          "field_metadata": {
            "allow_rich_text": true,
            "description": "",
            "multiline": false,
            "rich_text_type": "advanced",
            "version": 3
          },
          "multiple": false,
          "mandatory": false,
          "unique": false,
          "non_localizable": false
        }
      ],
      "last_activity": {},
      "maintain_revisions": true,
      "description": "",
      "DEFAULT_ACL": {
        "others": {
          "read": false,
          "create": false
        },
        "users": [
          {
            "uid": "bltb7dc5be19ed72dd9",
            "read": true,
            "sub_acl": {
              "read": true
            }
          }
        ]
      },
      "SYS_ACL": {
        "roles": [
          {
            "uid": "blt70c41dfd00924e9f",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            },
            "update": true,
            "delete": true
          },
          {
            "uid": "blt954756afc76573d1",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            },
            "update": true,
            "delete": true
          },
          {
            "uid": "blt5c82a78624ed860d",
            "read": true,
            "sub_acl": {
              "create": true,
              "read": true,
              "update": true,
              "delete": true,
              "publish": true
            }
          }
        ],
        "others": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "sub_acl": {
            "read": false,
            "create": false,
            "update": false,
            "delete": false,
            "publish": false
          }
        }
      },
      "options": {
        "is_page": false,
        "singleton": false,
        "title": "title",
        "sub_title": []
      },
      "abilities": {
        "get_one_object": true,
        "get_all_objects": true,
        "create_object": true,
        "update_object": true,
        "delete_object": true,
        "delete_all_objects": true
      }
    }
  ]
}

const assetFetchDataMock = {
  "asset": {
    "uid": "asset_uid",
    "created_at": "2019-08-16T08:05:30.460Z",
    "updated_at": "2019-08-16T08:05:30.460Z",
    "created_by": "bltcd82b2c6bf913241",
    "updated_by": "bltcd82b2c6bf913241",
    "content_type": "image/jpeg",
    "file_size": "69609",
    "tags": [],
    "filename": "in-galaxy-note-5-n9208-sm-n9208zdvins-000000003-back-gold.jpg",
    "url": "https://images.contentstack.io/v3/assets/api_key/asset_uid/5d5663ca9e9032233cab321a/in-galaxy-note-5-n9208-sm-n9208zdvins-000000003-back-gold.jpg",
    "ACL": {
      "roles": [],
      "others": {
        "read": false,
        "create": false,
        "update": false,
        "delete": false,
        "sub_acl": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "publish": false
        }
      }
    },
    "is_dir": false,
    "_version": 1,
    "title": "in-galaxy-note-5-n9208-sm-n9208zdvins-000000003-back-gold.jpg",
    "dimension": {
      "height": 615,
      "width": 802
    },
    "publish_details": {
      "environment": "blta39a4441696e35e0",
      "locale": "en-us",
      "time": "2019-08-19T12:28:47.432Z",
      "user": "blt587a89fc7883c56700a95bfe"
    }

  }
}

const contentTypeResponseMock = {
  "content_type": {
    "created_at": "2019-08-16T08:18:56.914Z",
    "updated_at": "2019-08-16T08:18:58.736Z",
    "title": "Product",
    "uid": "contentTypeUid",
    "_version": 2,
    "inbuilt_class": false,
    "schema": [
      {
        "display_name": "Title",
        "uid": "title",
        "data_type": "text",
        "mandatory": false,
        "unique": false,
        "field_metadata": {
          "_default": true,
          "instruction": "Product Name",
          "version": 3
        },
        "multiple": false,
        "non_localizable": false
      },
      {
        "display_name": "URL",
        "uid": "url",
        "data_type": "text",
        "mandatory": false,
        "field_metadata": {
          "_default": true,
          "version": 3
        },
        "multiple": false,
        "unique": false,
        "non_localizable": false
      }
    ],
    "last_activity": {
      "environments": [
        {
          "uid": "blta39a4441696e35e0",
          "details": [
            {
              "locale": "en-us",
              "time": "2019-08-23T13:02:25.439Z"
            }
          ]
        }
      ]
    },
    "maintain_revisions": true,
    "description": "",
    "DEFAULT_ACL": {
      "others": {
        "read": false,
        "create": false
      },
      "users": [
        {
          "uid": "bltb7dc5be19ed72dd9",
          "read": true,
          "sub_acl": {
            "read": true
          }
        }
      ]
    },
    "SYS_ACL": {
      "roles": [
        {
          "uid": "blt70c41dfd00924e9f",
          "read": true,
          "sub_acl": {
            "create": true,
            "read": true,
            "update": true,
            "delete": true,
            "publish": true
          },
          "update": true,
          "delete": true
        }
      ],
      "others": {
        "read": false,
        "create": false,
        "update": false,
        "delete": false,
        "sub_acl": {
          "read": false,
          "create": false,
          "update": false,
          "delete": false,
          "publish": false
        }
      }
    },
    "options": {
      "is_page": true,
      "singleton": false,
      "title": "title",
      "sub_title": [],
      "url_pattern": "/:title",
      "url_prefix": "/mobiles/"
    },
    "abilities": {
      "get_one_object": true,
      "get_all_objects": true,
      "create_object": true,
      "update_object": true,
      "delete_object": true,
      "delete_all_objects": true
    }
  }
}

const entryFindMock = {
  "entries": [
    {
      "locale": "en-us",
      "title": "Redmi Note Prime",
      "url": "/redmi-note-prime",
      "description": "<p>64-bit Qualcomm® SnapdragonTM 410, 2GB RAM,</p>\n<p>16GB Flash (up to 32GB microSD support), 13.97cm (5.5) HD IPS display, 13MP rear camera, 4G dual SIM, 3100mAh removable battery</p>",
      "images": [
        {
          "uid": "blt50a7a9dd6866776f",
          "created_at": "2019-08-16T08:05:18.932Z",
          "updated_at": "2019-08-16T08:05:18.932Z",
          "created_by": "bltcd82b2c6bf913241",
          "updated_by": "bltcd82b2c6bf913241",
          "content_type": "image/jpeg",
          "file_size": "145200",
          "tags": [],
          "filename": "01.jpg",
          "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/blt50a7a9dd6866776f/5d5663be34d39437c37c5376/01.jpg",
          "ACL": [],
          "is_dir": false,
          "_version": 1,
          "title": "01.jpg",
          "publish_details": {
            "environment": "blta39a4441696e35e0",
            "locale": "en-us",
            "time": "2019-08-19T12:28:56.964Z",
            "user": "blt587a89fc7883c56700a95bfe"
          }
        }
      ],
      "categories": [
        {
          "uid": "blt9d72fa3afc11d27f",
          "_content_type_uid": "category"
        }
      ],
      "price_in_usd": 117.3,
      "brand": [
        {
          "uid": "blta2e0d2130eb86263",
          "_content_type_uid": "brand"
        }
      ],
      "launch_date": "2016-08-17",
      "instock": true,
      "tags": [],
      "size": 16,
      "color": "Black",
      "additional_info": [
        {
          "rating": {
            "stars": 3
          }
        },
        {
          "deals": {
            "deal_name": "Deals of the Day",
            "deal_details": "If you are looking for good Amazon deals and bargains, Deal's of The Day Deals is the place to come. We are your online one-stop shop for savings and specials on our products."
          }
        }
      ],
      "bank_offers": [
        {
          "bank": [
            {
              "uid": "bltd9dc1c7363c42bbd",
              "_content_type_uid": "bank"
            }
          ],
          "card_type": [
            "Debit Card"
          ],
          "discount_in_percentage": 27
        },
        {
          "bank": [
            {
              "uid": "blt98058bb38f89fc5f",
              "_content_type_uid": "bank"
            }
          ],
          "card_type": [
            "Debit Card",
            "Credit Card"
          ],
          "discount_in_percentage": 24
        }
      ],
      "ACL": {},
      "uid": "blt4f1fd991ec80e52f",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "blt42e55757d70d5f81026a2b9f",
      "created_at": "2019-08-16T08:19:25.397Z",
      "updated_at": "2019-08-23T13:02:21.457Z",
      "_version": 4,
      "_in_progress": false,
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-23T13:02:25.439Z",
        "user": "blt42e55757d70d5f81026a2b9f"
      }
    },
    {
      "locale": "en-us",
      "title": "Redmi Note 3",
      "url": "/mobiles/redmi-note-3",
      "description": "<p>Redmi Note 3 is really fast—flagship fast. The high-performance Snapdragon 650 processor uses ARM's flagship Cortex-A72 cores to launch apps in a split-second. Its next-gen Adreno 510 graphics processor delivers a fluid gaming experience. The hexa-core processor delivers up to 1.8GHz clock speed, supports dual-channel memory and eMMC 5.0 flash. Combined with MIUI 7's system-level speed optimizations, Redmi Note 3 responds to every touch in a snap.</p>",
      "images": [
        {
          "uid": "blt9c3dff6e3151d374",
          "created_at": "2019-08-16T08:05:27.886Z",
          "updated_at": "2019-08-16T08:05:27.886Z",
          "created_by": "bltcd82b2c6bf913241",
          "updated_by": "bltcd82b2c6bf913241",
          "content_type": "image/jpeg",
          "file_size": "5275",
          "tags": [],
          "filename": "download.jpg",
          "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/blt9c3dff6e3151d374/5d5663c79722fb38d7db52e5/download.jpg",
          "ACL": [],
          "is_dir": false,
          "_version": 1,
          "title": "download.jpg",
          "publish_details": {
            "environment": "blta39a4441696e35e0",
            "locale": "en-us",
            "time": "2019-08-19T12:28:47.432Z",
            "user": "blt587a89fc7883c56700a95bfe"
          }
        }
      ],
      "categories": [
        {
          "uid": "blt9d72fa3afc11d27f",
          "_content_type_uid": "category"
        },
        {
          "uid": "blt9fa0f59d03862aa7",
          "_content_type_uid": "category"
        }
      ],
      "price_in_usd": 146,
      "brand": [
        {
          "uid": "blta2e0d2130eb86263",
          "_content_type_uid": "brand"
        }
      ],
      "launch_date": "2016-03-09",
      "instock": true,
      "tags": [
        "redmi",
        "smart"
      ],
      "size": 16,
      "color": "Gold",
      "additional_info": [
        {
          "deals": {
            "deal_name": "Summer Deal",
            "deal_details": "If you are looking for good Amazon deals and bargains, Summer's Deals is the place to come. We are your online one-stop shop for savings and specials on our products."
          }
        },
        {
          "rating": {
            "stars": 4
          }
        }
      ],
      "bank_offers": [
        {
          "bank": [
            {
              "uid": "bltc00b46e648007a0c",
              "_content_type_uid": "bank"
            }
          ],
          "card_type": [
            "Credit Card"
          ],
          "discount_in_percentage": 12
        }
      ],
      "ACL": {},
      "uid": "blta278bb5672180c94",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "blt42e55757d70d5f81026a2b9f",
      "created_at": "2019-08-16T08:19:27.182Z",
      "updated_at": "2019-08-23T13:01:19.866Z",
      "_version": 4,
      "_in_progress": false,
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-23T13:01:23.290Z",
        "user": "blt42e55757d70d5f81026a2b9f"
      }
    },
    {
      "locale": "en-us",
      "title": "iPhone 7 128GB",
      "url": "/mobiles/iphone-7",
      "description": "<p>iPhone 7 dramatically improves the most important aspects of the iPhone experience. It introduces advanced new camera systems. The best performance and battery life ever in an iPhone. Immersive stereo speakers. The brightest, most colorful iPhone display. Splash and water resistance.&nbsp;And it looks every bit as powerful as it is. This is iPhone 7.</p>",
      "images": [
        {
          "uid": "bltc4f54f7ce3155b0e",
          "created_at": "2019-08-16T08:05:15.889Z",
          "updated_at": "2019-08-16T08:05:15.889Z",
          "created_by": "bltcd82b2c6bf913241",
          "updated_by": "bltcd82b2c6bf913241",
          "content_type": "image/jpeg",
          "file_size": "48163",
          "tags": [],
          "filename": "iphone7.jpg",
          "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/bltc4f54f7ce3155b0e/5d5663bbdf859f364dbe36dd/iphone7.jpg",
          "ACL": [],
          "is_dir": false,
          "_version": 1,
          "title": "iphone7.jpg",
          "publish_details": {
            "environment": "blta39a4441696e35e0",
            "locale": "en-us",
            "time": "2019-08-19T12:28:56.964Z",
            "user": "blt587a89fc7883c56700a95bfe"
          }
        }
      ],
      "categories": [
        {
          "uid": "blt9d72fa3afc11d27f",
          "_content_type_uid": "category"
        }
      ],
      "price_in_usd": 749,
      "brand": [
        {
          "uid": "blte6095f030e4b7a30",
          "_content_type_uid": "brand"
        }
      ],
      "launch_date": "2016-09-07",
      "instock": true,
      "tags": [],
      "size": 128,
      "color": "Black",
      "additional_info": [
        {
          "rating": {
            "stars": 5
          }
        },
        {
          "deals": {
            "deal_name": "Black Friday Deal",
            "deal_details": "If you are looking for good Amazon deals and bargains, Black Friday Deals is the place to come. We are your online one-stop shop for savings and specials on our products."
          }
        }
      ],
      "bank_offers": [
        {
          "bank": [
            {
              "uid": "bltf05621cb52725856",
              "_content_type_uid": "bank"
            }
          ],
          "card_type": [
            "Debit Card"
          ],
          "discount_in_percentage": 12
        }
      ],
      "ACL": {},
      "uid": "bltbd92ac498e3d5f96",
      "created_by": "bltcd82b2c6bf913241",
      "updated_by": "blt42e55757d70d5f81026a2b9f",
      "created_at": "2019-08-16T08:19:20.072Z",
      "updated_at": "2019-08-23T12:50:53.424Z",
      "_version": 13,
      "_in_progress": false,
      "publish_details": {
        "environment": "blta39a4441696e35e0",
        "locale": "en-us",
        "time": "2019-08-23T12:50:56.727Z",
        "user": "blt42e55757d70d5f81026a2b9f"
      }
    }
  ]
}

const entryFetchMock = {
  "entry": {
    "locale": "en-us",
    "title": "Redmi Note 3",
    "url": "/mobiles/redmi-note-3",
    "description": "<p>Redmi Note 3 is really fast—flagship fast. The high-performance Snapdragon 650 processor uses ARM's flagship Cortex-A72 cores to launch apps in a split-second. Its next-gen Adreno 510 graphics processor delivers a fluid gaming experience. The hexa-core processor delivers up to 1.8GHz clock speed, supports dual-channel memory and eMMC 5.0 flash. Combined with MIUI 7's system-level speed optimizations, Redmi Note 3 responds to every touch in a snap.</p>",
    "images": [
      {
        "uid": "blt9c3dff6e3151d374",
        "created_at": "2019-08-16T08:05:27.886Z",
        "updated_at": "2019-08-16T08:05:27.886Z",
        "created_by": "bltcd82b2c6bf913241",
        "updated_by": "bltcd82b2c6bf913241",
        "content_type": "image/jpeg",
        "file_size": "5275",
        "tags": [],
        "filename": "download.jpg",
        "url": "https://images.contentstack.io/v3/assets/blt02f7b45378b008ee/blt9c3dff6e3151d374/5d5663c79722fb38d7db52e5/download.jpg",
        "ACL": [],
        "is_dir": false,
        "_version": 1,
        "title": "download.jpg",
        "publish_details": {
          "environment": "blta39a4441696e35e0",
          "locale": "en-us",
          "time": "2019-08-19T12:28:47.432Z",
          "user": "blt587a89fc7883c56700a95bfe"
        }
      }
    ],
    "categories": [
      {
        "uid": "blt9d72fa3afc11d27f",
        "_content_type_uid": "category"
      },
      {
        "uid": "blt9fa0f59d03862aa7",
        "_content_type_uid": "category"
      }
    ],
    "price_in_usd": 146,
    "brand": [
      {
        "uid": "blta2e0d2130eb86263",
        "_content_type_uid": "brand"
      }
    ],
    "launch_date": "2016-03-09",
    "instock": true,
    "tags": [
      "redmi",
      "smart"
    ],
    "size": 16,
    "color": "Gold",
    "additional_info": [
      {
        "deals": {
          "deal_name": "Summer Deal",
          "deal_details": "If you are looking for good Amazon deals and bargains, Summer's Deals is the place to come. We are your online one-stop shop for savings and specials on our products."
        }
      },
      {
        "rating": {
          "stars": 4
        }
      }
    ],
    "bank_offers": [
      {
        "bank": [
          {
            "uid": "bltc00b46e648007a0c",
            "_content_type_uid": "bank"
          }
        ],
        "card_type": [
          "Credit Card"
        ],
        "discount_in_percentage": 12
      }
    ],
    "ACL": {},
    "uid": "blta278bb5672180c94",
    "created_by": "bltcd82b2c6bf913241",
    "updated_by": "blt42e55757d70d5f81026a2b9f",
    "created_at": "2019-08-16T08:19:27.182Z",
    "updated_at": "2019-08-23T13:01:19.866Z",
    "_version": 4,
    "_in_progress": false,
    "publish_details": {
      "environment": "blta39a4441696e35e0",
      "locale": "en-us",
      "time": "2019-08-23T13:01:23.290Z",
      "user": "blt42e55757d70d5f81026a2b9f"
    }
  }
}
const syncResult: any = { ...axiosGetMock.data };

export { 
  axiosGetMock,
  syncResult,
  assetFetchDataMock,
  assetQueryFindResponseDataMock,
  contentTypeQueryFindResponseDataMock,
  contentTypeResponseMock,
  entryFindMock,
  entryFetchMock
};
