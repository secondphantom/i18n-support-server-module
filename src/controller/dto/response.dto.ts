export class ResponseDto<T = any> {
  private _status: number;
  private _payload: {
    success: boolean;
    data: T;
  };

  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: {
      success: boolean;
      data: T;
    };
  }) {
    this._status = status;
    this._payload = payload;
  }

  get status() {
    return this._status;
  }

  get payload() {
    return this._payload;
  }

  getJson = () => {
    return this._payload;
  };
}
