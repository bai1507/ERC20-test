# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
测试以太网查合约是不是部署了：
https://goerli.etherscan.io/address/0xC4b4a2eCCD248d7971E242D4c41eE928B2777A8d

创建项目获取apikey
https://www.alchemy.com/

测试网获取测试币
https://goerlifaucet.com/
以往区块链被攻击的事件
https://rekt.news/zh/

//插件安装
npm i @openzeppelin/contracts
npm i -D dotenv



//部署合约
npx hardhat run scripts/deploy .js 
//部署到测试网络 换成localhost就部署到节点网络
npx hardhat run scripts/deploy.js --network goerli
//编译合约，不过部署的时候会编译
npx hardhat compile
//清楚缓存文件
npx hardhat clean:
//可以自定义任务，比如我再task中定义了一个查看区块号的task
npx hardhat block-number 
npx hardhat block-number --network goerli
//运行测试
npx hardhat test
//通过coverage插件，可查看测试覆盖率
npx hardhat coverage
//执行solhint插件，查看代码哪些不规范
npx  solhint "contracts/*.sol"
//全部文件格式化，美化
npx prettier --write .
