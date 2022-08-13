export enum ResultCode {
  SUCCESS = 1,
  PHONE_IS_USED,
  FB_OAUTH_ERROR,
  TAPPAY_ERROR,
  WRONG_PASSWORD,
  ACCOUNT_NOT_EXIST,
  ACCOUNT_ALREADY_EXIST,
  SMS_TOKEN_ERROR,
  SMS_TOKEN_EXPIRED,
  SMS_TOKEN_NOT_EXIST,
  SMS_VERIFY_CODE_ERROR,
  SYSTEM_ERROR,
  VERIFY_CODE_ERROR,
  GOOGLE_OAUTH_ERROR,
  LEFUN_TRANS_EXPIRED,
  PERCHASELOG_NOT_EXIST,
  VERIFY_TOKEN_ERROR,
  CHECKSUM_NOT_VALID,
  WRONG_DEVICE_ID,
  PAYMENT_INVALID,
  RECOVERY_CODE_ERROR,
  INVOICE_NOT_EXIST
}

export interface ReturnObj {
  resultCode: ResultCode;
  resultMessage: string;
  resultDes: string;
  resultData: any;
}

export function getReturnObj(
  resultCode: ResultCode,
  resultdata = {}
): ReturnObj {
  switch (resultCode) {
    case ResultCode.SUCCESS: {
      return {
        resultCode: ResultCode.SUCCESS,
        resultMessage: "SUCCESS",
        resultDes: "成功",
        resultData: resultdata
      };
    }
    case ResultCode.PHONE_IS_USED: {
      return {
        resultCode: ResultCode.PHONE_IS_USED,
        resultMessage: "PHONE_IS_USED",
        resultDes: "手機號碼已被使用",
        resultData: resultdata
      };
    }
    case ResultCode.ACCOUNT_ALREADY_EXIST: {
      return {
        resultCode: ResultCode.ACCOUNT_ALREADY_EXIST,
        resultMessage: "ACCOUNT_ALREADY_EXIST",
        resultDes: "帳號存在",
        resultData: resultdata
      };
    }
    case ResultCode.WRONG_PASSWORD: {
      return {
        resultCode: ResultCode.WRONG_PASSWORD,
        resultMessage: "WRONG_PASSWORD",
        resultDes: "密碼錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.SMS_TOKEN_ERROR: {
      return {
        resultCode: ResultCode.SMS_TOKEN_ERROR,
        resultMessage: "SMS_TOKEN_ERROR",
        resultDes: "簡訊驗證參數錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.FB_OAUTH_ERROR: {
      return {
        resultCode: ResultCode.FB_OAUTH_ERROR,
        resultMessage: "FB_OAUTH_ERROR",
        resultDes: "Facebook授權錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.GOOGLE_OAUTH_ERROR: {
      return {
        resultCode: ResultCode.GOOGLE_OAUTH_ERROR,
        resultMessage: "GOOGLE_OAUTH_ERROR",
        resultDes: "GOOGLE授權錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.TAPPAY_ERROR: {
      return {
        resultCode: ResultCode.TAPPAY_ERROR,
        resultMessage: "TAPPAY_ERROR",
        resultDes: "Tappay呼叫異常",
        resultData: resultdata
      };
    }
    case ResultCode.ACCOUNT_NOT_EXIST: {
      return {
        resultCode: ResultCode.ACCOUNT_NOT_EXIST,
        resultMessage: "ACCOUNT_NOT_EXIST",
        resultDes: "帳號不存在",
        resultData: resultdata
      };
    }
    case ResultCode.SMS_TOKEN_EXPIRED: {
      return {
        resultCode: ResultCode.SMS_TOKEN_EXPIRED,
        resultMessage: "SMS_TOKEN_EXPIRED",
        resultDes: "簡訊驗證參數過期",
        resultData: resultdata
      };
    }
    case ResultCode.SMS_TOKEN_NOT_EXIST: {
      return {
        resultCode: ResultCode.SMS_TOKEN_NOT_EXIST,
        resultMessage: "SMS_TOKEN_NOT_EXIST",
        resultDes: "簡訊驗證參數不存在",
        resultData: resultdata
      };
    }
    case ResultCode.SMS_TOKEN_EXPIRED: {
      return {
        resultCode: ResultCode.SMS_TOKEN_EXPIRED,
        resultMessage: "SMS_TOKEN_EXPIRED",
        resultDes: "簡訊驗證參數過期",
        resultData: resultdata
      };
    }
    case ResultCode.SMS_VERIFY_CODE_ERROR: {
      return {
        resultCode: ResultCode.SMS_VERIFY_CODE_ERROR,
        resultMessage: "SMS_VERIFY_CODE_ERROR",
        resultDes: "簡訊驗證碼錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.SYSTEM_ERROR: {
      return {
        resultCode: ResultCode.SYSTEM_ERROR,
        resultMessage: "SYSTEM_ERROR",
        resultDes: "系統錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.VERIFY_CODE_ERROR: {
      return {
        resultCode: ResultCode.VERIFY_CODE_ERROR,
        resultMessage: "VERIFY_CODE_ERROR",
        resultDes: "安全密碼錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.LEFUN_TRANS_EXPIRED: {
      return {
        resultCode: ResultCode.LEFUN_TRANS_EXPIRED,
        resultMessage: "LEFUN_TRANS_EXPIRED",
        resultDes: "樂坊交易參數過期",
        resultData: resultdata
      };
    }
    case ResultCode.PERCHASELOG_NOT_EXIST: {
      return {
        resultCode: ResultCode.PERCHASELOG_NOT_EXIST,
        resultMessage: "PERCHASELOG_NOT_EXIST",
        resultDes: "交易紀錄不存在",
        resultData: resultdata
      };
    }
    case ResultCode.VERIFY_TOKEN_ERROR: {
      return {
        resultCode: ResultCode.VERIFY_TOKEN_ERROR,
        resultMessage: "VERIFY_TOKEN_ERROR",
        resultDes: "交易安全碼錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.CHECKSUM_NOT_VALID: {
      return {
        resultCode: ResultCode.CHECKSUM_NOT_VALID,
        resultMessage: "CHECKSUM_NOT_VALID",
        resultDes: "checksum驗證錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.WRONG_DEVICE_ID: {
      return {
        resultCode: ResultCode.WRONG_DEVICE_ID,
        resultMessage: "WRONG_DEVICE_ID",
        resultDes: "裝置名稱錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.PAYMENT_INVALID: {
      return {
        resultCode: ResultCode.PAYMENT_INVALID,
        resultMessage: "PAYMENT_INVALID",
        resultDes: "前次交易信用卡異常，請更換信用卡",
        resultData: resultdata
      };
    }
    case ResultCode.RECOVERY_CODE_ERROR: {
      return {
        resultCode: ResultCode.RECOVERY_CODE_ERROR,
        resultMessage: "RECOVERY_CODE_ERROR",
        resultDes: "還原碼錯誤",
        resultData: resultdata
      };
    }
    case ResultCode.INVOICE_NOT_EXIST: {
      return {
        resultCode: ResultCode.INVOICE_NOT_EXIST,
        resultMessage: "INVOICE_NOT_EXIST",
        resultDes: "尚未開立發票",
        resultData: resultdata
      };
    }
    default: {
      return {
        resultCode: 500,
        resultMessage: "ERROR",
        resultDes: "系統異常",
        resultData: resultdata
      };
    }
  }
}
