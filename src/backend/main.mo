import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Record = {
    id : Nat;
    brokerageAmountReceivedDate : ?Text;
    bankAmountReceivedDate : ?Text;
    finance : Text;
    customerName : Text;
    mcf : Text;
    product : Text;
    loanAmount : Text;
    grossAmount : Text;
    netAmount : Text;
    remark : Text;
    createdAt : Int;
  };

  func compareRecords(record1 : Record, record2 : Record) : Order.Order {
    Nat.compare(record1.id, record2.id);
  };

  let records = Map.empty<Nat, Record>();
  var nextId = 1;

  public shared ({ caller }) func addRecord(
    brokerageAmountReceivedDate : ?Text,
    bankAmountReceivedDate : ?Text,
    finance : Text,
    customerName : Text,
    mcf : Text,
    product : Text,
    loanAmount : Text,
    grossAmount : Text,
    netAmount : Text,
    remark : Text,
    createdAt : Int,
  ) : async Nat {
    let id = nextId;
    records.add(
      id,
      {
        id;
        brokerageAmountReceivedDate;
        bankAmountReceivedDate;
        finance;
        customerName;
        mcf;
        product;
        loanAmount;
        grossAmount;
        netAmount;
        remark;
        createdAt;
      },
    );
    nextId += 1;
    id;
  };

  public query ({ caller }) func getAllRecords() : async [Record] {
    let arr = records.values().toArray();
    arr.sort(compareRecords);
  };

  public query ({ caller }) func getRecord(id : Nat) : async Record {
    switch (records.get(id)) {
      case (null) { Runtime.trap("Record does not exist") };
      case (?record) { record };
    };
  };

  public shared ({ caller }) func updateRecord(
    id : Nat,
    brokerageAmountReceivedDate : ?Text,
    bankAmountReceivedDate : ?Text,
    finance : Text,
    customerName : Text,
    mcf : Text,
    product : Text,
    loanAmount : Text,
    grossAmount : Text,
    netAmount : Text,
    remark : Text,
    createdAt : Int,
  ) : async () {
    if (not records.containsKey(id)) {
      Runtime.trap("Record does not exist");
    };
    let updatedRecord : Record = {
      id;
      brokerageAmountReceivedDate;
      bankAmountReceivedDate;
      finance;
      customerName;
      mcf;
      product;
      loanAmount;
      grossAmount;
      netAmount;
      remark;
      createdAt;
    };
    records.add(id, updatedRecord);
  };

  public shared ({ caller }) func deleteRecord(id : Nat) : async () {
    if (not records.containsKey(id)) {
      Runtime.trap("Record does not exist");
    };
    records.remove(id);
  };
};
