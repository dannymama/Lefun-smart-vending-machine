/**
 * Created by ying.wu on 2017/6/27.
 */
// 開立發票
const ecpay_invoice = require("../lib/ecpay_invoice.js");
const helper = require("../lib/ecpay_invoice/helper");
// 參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
let base_param = {
  RelateNumber: "aaaaaadfsd", // 請帶30碼uid, ex: werntfg9os48trhw34etrwerh8ew2r
  CustomerID: "12124", // 客戶代號，長度為20字元
  CustomerIdentifier: "", // 統一編號，長度為8字元
  CustomerName: "綠先生", // 客戶名稱，長度為20字元
  CustomerAddr: "台北市南港區三重路19-2號6-2樓()", // 客戶地址，長度為100字元
  CustomerPhone: "0912345678", // 客戶電話，長度為20字元
  CustomerEmail: "ying.wu@ecpay.com.tw", // 客戶信箱，長度為80字元
  ClearanceMark: "", // 通關方式，僅可帶入'1'、'2'、''
  Print: "0", // 列印註記，僅可帶入'0'、'1'
  Donation: "1", // 捐贈註記，僅可帶入'1'、'0'
  LoveCode: "168001", // 愛心碼，長度為7字元
  CarruerType: "", // 載具類別，僅可帶入'1'、'2'、'3'、''
  CarruerNum: "", // 載具編號，當載具類別為'2'時，長度為16字元，當載具類別為'3'時，長度為7字元
  TaxType: "1", // 課稅類別，僅可帶入'1'、'2'、'3'、'9'
  SalesAmount: "200", // 發票金額
  InvoiceRemark: "", // 備註
  ItemName: "洗衣精|洗髮乳", // 商品名稱，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
  ItemCount: "1|1", // 商品數量，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
  ItemWord: "瓶|罐", // 商品單位，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
  ItemPrice: "100|100", // 商品價格，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
  ItemTaxType: "", // 商品課稅別，如果超過一樣商品時請以｜(為半形不可使用全形)分隔，如果TaxType為9請帶值，其餘為空
  ItemAmount: "100|100", // 商品合計，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
  ItemRemark: "test item|test item", // 商品備註，如果超過一樣商品時請以｜(為半形不可使用全形)分隔
  InvType: "07", // 字軌類別，、'07'一般稅額、'08'特種稅額
  vat: "1" // 商品單價是否含稅，'1'為含稅價'、'2'為未稅價
};

let create = new ecpay_invoice();
let res = create.invoice_client.ecpay_invoice_issue((parameters = base_param));
let h = new helper();
res
  .then(function(result) {
    console.log(result);
    console.log(
      h.gen_chk_mac_value(
        {
          MerchantID: "2000132",
          InvoiceNumber: "RF14344778",
          RandomNumber: "5534",
          StartDate: "2019-06-06"
        },
        0
      )
    );
  })
  .catch(function(err) {
    console.log(err);
  });
