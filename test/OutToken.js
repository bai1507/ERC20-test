const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");
const {
  developmentChains,
  INITIAL_SUPPLY,
} = require("../helper-hardhat-config");
console.log(network.name);
console.log(developmentChains);
//before与beforeach的区别
// before() is run once before all the tests in a describe
// after()   is run once after all the tests in a describe
// beforeEach() is run before each test in a describe
// afterEach()   is run after each test in a describe
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OurToken Unit Test", function () {
      let TokenFactory, token, owner, addr, addr2;
      const value = ethers.utils.parseUnits("1");
      const INITIAL_SUPPLY = "1000000000000000000000000";
      before(async () => {
        [owner, addr, addr2] = await ethers.getSigners();

        TokenFactory = await ethers.getContractFactory("OutToken", owner);
        token = await TokenFactory.deploy(INITIAL_SUPPLY);
        await token.deployed();
        //erc20 =  await ERCToken.deploy("OUT","OT");
        const startOwnerAmount = await token.provider.getBalance(owner.address);
        // console.log(startOwnerAmount)
      });
      it("was deployed", async () => {
        assert(token.address);
      });
      describe("constructor", () => {
        it("Should have correct INITIAL_SUPPLY of token ", async () => {
          const totalSupply = await token.totalSupply();
          assert.equal(totalSupply.toString(), INITIAL_SUPPLY);
        });
      });
      describe("transfers", () => {
        const token_spend = ethers.utils.parseUnits("10");

        it("Should be able to transfer tokens successfully", async () => {
          const totalSupply = await token.totalSupply();

          await token.transfer(addr.address, token_spend);
          const addr_balance = await token.balanceOf(addr.address);
          expect(addr_balance.toString()).to.be.equal(token_spend.toString());
        });
        it("can addr  transfer to addr2", async () => {
          const amount = ethers.utils.parseUnits("2");

          await token.connect(addr).transfer(addr2.address, amount);
          const addr2_balance = await token.balanceOf(addr2.address);
          expect(addr2_balance.toString()).to.equal(amount.toString());
        });
      });

      describe("allowance", () => {
        const token_spend = ethers.utils.parseUnits("5");
        const token_spend2 = ethers.utils.parseUnits("4");
        it("approve someone to transfer", async () => {
          //允许address获取5个ETH的配额
          await token.approve(addr.address, token_spend);
          const before_addr = await token.allowance(
            owner.address,
            addr.address
          );
          expect(before_addr.toString()).to.equal(token_spend);
        });
        it("increase Allowance", async () => {
          //让addr增加两个配额，有7个eth的配额
          const amount = ethers.utils.parseUnits("2");
          await token.increaseAllowance(addr.address, amount);
          const after_addr = await token.allowance(owner.address, addr.address);
          expect(after_addr.toString()).to.equal(amount.add(token_spend));
        });
        it("allow someone to transfer", async () => {
          //b 执行transferFrom(A,C,100)
          //总结：其实就是A转入C,但是要经过B的账号来发送交易
          const after_addr = await token.allowance(owner.address, addr.address);
          console.log(after_addr); //7eth
          await token
            .connect(addr)
            .transferFrom(owner.address, addr2.address, token_spend2);
          // const after_addr =await token.allowance(owner.address,addr.address);
          // console.log(after_addr);
          const addr2_balance = await token.balanceOf(addr2.address);
          const addr_balance = await token.allowance(
            owner.address,
            addr.address
          );
        });
        it("decrease Allowance", async () => {
          const amount = ethers.utils.parseUnits("2");
          const leftamount = ethers.utils.parseUnits("1");
          await token.decreaseAllowance(addr.address, amount);
          const after_addr = await token.allowance(owner.address, addr.address);
          expect(after_addr.toString()).to.equal(leftamount);
        });
      });
      describe("gasReport", () => {
        it("test buy gas function", async () => {
          const amount = ethers.utils.parseUnits("2");
          const startAmount = await token.provider.getBalance(token.address);
          const startOwnerAmount = await token.provider.getBalance(
            owner.address
          );
          console.log(
            `开始阶段：合约地址${startAmount} 拥有者地址${startOwnerAmount}`
          );
          const response = await token.Buy(addr.address, { value: amount });
          const responseReceipt = await response.wait(1);
          const { gasUsed, effectiveGasPrice } = responseReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          console.log(gasCost);

          const endingAmount = await token.provider.getBalance(token.address);
          const endingOwnerAmount = await token.provider.getBalance(
            owner.address
          );

          console.log(
            `结束阶段：合约地址${endingAmount} 拥有者地址${endingOwnerAmount}`
          );
          console.log(
            startOwnerAmount.sub(endingOwnerAmount.add(endingAmount))
          );
        });

        it("test withdraw gas function", async () => {
          const amount = ethers.utils.parseUnits("2");
          const startAmount = await token.provider.getBalance(token.address);
          const startOwnerAmount = await token.provider.getBalance(
            owner.address
          );
          console.log(
            `开始阶段：合约地址${startAmount} 拥有者地址${startOwnerAmount}`
          );
          const response = await token.withdraw();
          const responseReceipt = await response.wait(1);
          const { gasUsed, effectiveGasPrice } = responseReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          console.log(gasCost);
          const endingAmount = await token.provider.getBalance(token.address);
          const endingOwnerAmount = await token.provider.getBalance(
            owner.address
          );
          console.log(
            `结束阶段：合约地址${endingAmount} 拥有者地址${endingOwnerAmount}`
          );
          assert(
            startAmount.add(startOwnerAmount).toString(),
            endingOwnerAmount.add(gasCost).toString()
          );
        });
      });
    });
