
class Guest {
  constructor(data = {}) {
    this.id = null;
    this.guestname = null;
    this.shame_tokens = null;
    this.token = null;
    this.status = null;
    this.isUser = null;
    Object.assign(this, data);
  }
}

export default User;