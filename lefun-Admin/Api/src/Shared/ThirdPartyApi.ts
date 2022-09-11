import axios from "axios";
import { Injectable } from "@nestjs/common";

import * as querystring from "querystring";
import { config } from "../Config/config";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(config.GOOGLE_API_CLIENTID);
const ecpay_invoice = require("ecpay_invoice_nodejs");

@Injectable()
export class Tappay {
  private _httpHeader: object;
  constructor() {
    this._httpHeader = {
      "x-api-key": config.TAYPAY_PARTNER_KEY,
      "Content-Type": "application/json"
    };
  }

  public async payByPrime(
    prime: string,
    amount: number,
    details: string
  ): Promise<any> {
    let payLoad = {
      prime: prime,
      partner_key: config.TAYPAY_PARTNER_KEY,
      merchant_id: config.TAYPAY_MERCHANT_ID,
      details: details,
      amount: amount,
      cardholder: {
        phone_number: "",
        name: "",
        email: ""
      },
      remember: true
    };
    let res = await axios.post(
      config.TAYPAY_API + "/payment/pay-by-prime",
      payLoad,
      {
        headers: this._httpHeader
      }
    );
    return res.data;
  }

  public async payByToken(
    taypay_token: string,
    taypay_secret: string,
    amount: number,
    details: string
  ): Promise<any> {
    let payLoad = {
      card_key: taypay_token,
      card_token: taypay_secret,
      currency: "TWD",
      partner_key: config.TAYPAY_PARTNER_KEY,
      merchant_id: config.TAYPAY_MERCHANT_ID,
      details: details,
      amount: amount
    };
    let res = await axios.post(
      config.TAYPAY_API + "/payment/pay-by-token",
      payLoad,
      {
        headers: this._httpHeader
      }
    );
    return res.data;
  }

  public async bindCard(prime: string): Promise<any> {
    let payLoad = {
      prime: prime,
      currency: "TWD",
      partner_key: config.TAYPAY_PARTNER_KEY,
      merchant_id: config.TAYPAY_MERCHANT_ID,
      cardholder: {
        phone_number: "",
        name: "",
        email: ""
      }
    };
    let res = await axios.post(config.TAYPAY_API + "/card/bind", payLoad, {
      headers: this._httpHeader
    });
    return res.data;
  }
}

export class FacebookApi {
  public async verifyAccessToken(fb_accesstoken: string): Promise<any> {
    let res = await axios.get(
      config.FB_API + "/me?access_token=" + fb_accesstoken
    );
    return res;
  }
}

export class GoogleApi {
  public async verifyAccessToken(google_accesstoken: string): Promise<any> {
    try {
      let ticket = await client.verifyIdToken({
        idToken: google_accesstoken,
        audience: config.GOOGLE_API_CLIENTID
      });

      let payload = ticket.getPayload();
      let userid = payload["sub"];

      return { isSuccess: 1, userid: userid };
    } catch (err) {
      return { isSuccess: 0, userid: "" };
    }
  }
}

@Injectable()
export class SMSExpress {
  public async sendSMS(
    phone_number: string,
    sms_token: string,
    sms_content: string
  ): Promise<void> {
    let smsBody = querystring.escape(sms_content);
    try {
      let queryString =
        "username=" +
        config.SMS_EXPRESS_USERNAME +
        "&password=" +
        config.SMS_EXPRESS_PASSWORD +
        "&dstaddr=" +
        phone_number +
        "&DestName=" +
        sms_token +
        "&dlvtime=&vldtime=3600&smbody=" +
        smsBody +
        "&encoding=UTF8";
      //await axios.get(config.SMS_EXPRESS_API + "?" + queryString);
    } catch (err) {
      console.log(err);
    }
  }
}

export class ECPAYInvoice {
  //開立發票
  public async issue(name: string, ItemAmount: string): Promise<string> {
    try {
      let base_param = {
        RelateNumber: new Date().toJSON().toString() + this.randomString(6), // 請帶30碼uid, ex: werntfg9os48trhw34etrwerh8ew2r
        CustomerID: "12124", // 客戶代號，長度為20字元
        CustomerIdentifier: "", // 統一編號，長度為8字元
        CustomerName: name, // 客戶名稱，長度為20字元
        CustomerAddr: "", // 客戶地址，長度為100字元
        CustomerPhone: "0912345678", // 客戶電話，長度為20字元
        CustomerEmail: "ying.wu@ecpay.com.tw", // 客戶信箱，長度為80字元
        ClearanceMark: "", // 通關方式，僅可帶入'1'、'2'、''
        Print: "0", // 列印註記，僅可帶入'0'、'1'
        Donation: "0", // 捐贈註記，僅可帶入'1'、'0'
        LoveCode: "", // 愛心碼，長度為7字元
        CarruerType: "", // 載具類別，僅可帶入'1'、'2'、'3'、''
        CarruerNum: "", // 載具編號，當載具類別為'2'時，長度為16字元，當載具類別為'3'時，長度為7字元
        TaxType: "1", // 課稅類別，僅可帶入'1'、'2'、'3'、'9'
        SalesAmount: ItemAmount, // 發票金額
        InvoiceRemark: "", // 備註
        ItemName: "洗衣精", // 商品名稱，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
        ItemCount: "1", // 商品數量，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
        ItemWord: "瓶", // 商品單位，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
        ItemPrice: ItemAmount, // 商品價格，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
        ItemTaxType: "", // 商品課稅別，如果超過一樣商品時請以｜(為半形不可使用全形)分隔，如果TaxType為9請帶值，其餘為空
        ItemAmount: ItemAmount, // 商品合計，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
        ItemRemark: "test item", // 商品備註，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
        InvType: "07", // 字軌類別，、'07'一般稅額、'08'特種稅額
        vat: "1" // 商品單價是否含稅，'1'為含稅價'、'2'為未稅價
      };
      let create = new ecpay_invoice();
      let invoiceRes = await create.invoice_client.ecpay_invoice_issue(
        base_param
      );
      let resObj = querystring.parse(invoiceRes);
      let datestring = new Date().toJSON().split("T")[0];
      let urlParam =
        "MerchantID=2000132&InvoiceNumber=" +
        resObj.InvoiceNumber +
        "&RandomNumber=" +
        resObj.RandomNumber +
        "&StartDate=" +
        datestring;
      let invoiceUrl =
        "https://einvoice-stage.ecpay.com.tw/SearchInvoice/InvoiceDetail?" +
        urlParam +
        "&CheckMacValue=" +
        create.helper.gen_chk_mac_value(
          {
            MerchantID: "2000132",
            InvoiceNumber: resObj.InvoiceNumber,
            RandomNumber: resObj.RandomNumber,
            StartDate: datestring
          },
          0
        );
      return invoiceUrl;
    } catch (err) {}
  }
  public async query_issue(RelateNumber: string): Promise<any> {
    try {
      let base_param = {
        RelateNumber: RelateNumber
      };
      let create = new ecpay_invoice();
      let res = await create.query_client.ecpay_query_invoice_issue(base_param);

      let resObj = querystring.parse(res);
      let datestring = new Date().toJSON().split("T")[0];
      let urlParam =
        "MerchantID=2000132&InvoiceNumber=" +
        resObj.IIS_Number +
        "&RandomNumber=" +
        resObj.IIS_Random_Number +
        "&StartDate=" +
        datestring;
      let invoiceUrl =
        "https://einvoice-stage.ecpay.com.tw/SearchInvoice/InvoiceDetail?" +
        urlParam +
        "&CheckMacValue=" +
        create.helper.gen_chk_mac_value(
          {
            MerchantID: create.helper.get_mercid(),
            InvoiceNumber: resObj.IIS_Number,
            RandomNumber: resObj.IIS_Random_Number,
            StartDate: datestring
          },
          0
        );

      return { res: res, invoiceUrl: invoiceUrl };
    } catch (err) {}
  }
  randomString(length: number) {
    if (length < 3) length = 3;
    if (length > 6) length = 6;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < length; i++) {
      text += possible[Math.floor(Math.random() * possible.length)];
    }
    return text;
  }
}
