class Atom<T> {
  val: T;
  constructor(val: T) {
    this.val = val;
  }
}

class AtNum extends Atom<number>{}
class AtSymb extends Atom<string> {}
class AtBool extends Atom<boolean> {}