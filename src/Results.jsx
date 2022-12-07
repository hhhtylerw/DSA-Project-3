import './Results.css'

const data = [
  {
    passwordNumber: "guest",
    hashValueSHA: "ed14796b9e8a86379a26120372f91ed",
    executionTimeSHA: "1",
    hashValueMD5: "084e0343a0486ff05530df6c705c8bb4",
    executionTimeMD5: "1",
  },
  {
    passwordNumber: "12345",
    hashValueSHA: "b1c20ce122396e1cc2f6ffd6322a0677",
    executionTimeSHA: "2",
    hashValueMD5: "827ccb0eea8a706c4c34a16891f84e7b",
    executionTimeMD5: "2",
  },
  {
    passwordNumber: "1234",
    hashValueSHA: "b1bfca6b6ed111edead905a159e410a2",
    executionTimeSHA: "3",
    hashValueMD5: "81dc9bdb52d04dc20036dbd8313ed055",
    executionTimeMD5: "3",
  },
  {
    passwordNumber: "password",
    hashValueSHA: "4482cf1e669d230a666958388b80f7ad",
    executionTimeSHA: "4",
    hashValueMD5: "5f4dcc3b5aa765d61d8327deb882cf99",
    executionTimeMD5: "4",
  },
  {
    passwordNumber: "a1b2c3",
    hashValueSHA: "70933960c63c9969eaa63932734e513",
    executionTimeSHA: "5",
    hashValueMD5: "3c086f596b4aee58e1d71b3626fefc87",
    executionTimeMD5: "5",
  },
  {
    passwordNumber: "liverpool",
    hashValueSHA: "274b76972bb1a9112119c032f1ee798",
    executionTimeSHA: "6",
    hashValueMD5: "d177b4d1d9e6b6fa86521e4b3d00b029",
    executionTimeMD5: "6",
  },
  {
    passwordNumber: "qwerty",
    hashValueSHA: "16df912e79d2a86f9c22ccde470de486",
    executionTimeSHA: "7",
    hashValueMD5: "d8578edf8458ce06fbc5bb76a58c5ca4",
    executionTimeMD5: "7",
  },
  {
    passwordNumber: "arsenal",
    hashValueSHA: "3e24d2115ad8993b749c19a737293060",
    executionTimeSHA: "8",
    hashValueMD5: "1c5442c0461e5186126aaba26edd6857",
    executionTimeMD5: "8",
  },
  {
    passwordNumber: "123456789",
    hashValueSHA: "70dfe6aaf6e534d502e6f1ad3bb8f3e",
    executionTimeSHA: "9",
    hashValueMD5: "25f9e794323b453885f5181f1b624d0b",
    executionTimeMD5: "9",
  },
  {
    passwordNumber: "abc123",
    hashValueSHA: "499c88f89d13d098e93069d864c053e3",
    executionTimeSHA: "10",
    hashValueMD5: "e99a18c428cb38d5f260853678922e03",
    executionTimeMD5: "10",
  },
]

const setData = [
  {
    hashType: "SHA",
    size: "1000000",
    executionTime: "911.7844 ms",
  },
  {
    hashType: "MD5",
    size: "1000000",
    executionTime: "893.2208 ms",
  },
  {
    hashType: "SHA",
    size: "10000000",
    executionTime: "9.3081149 s",
  },
  {
    hashType: "MD5",
    size: "10000000",
    executionTime: "8.3191507 s",
  },
  {
    hashType: "SHA",
    size: "100000000",
    executionTime: "94.0963218 s",
  },
  {
    hashType: "MD5",
    size: "100000000",
    executionTime: "87.063166 s",
  },
]

const LargeDataset = ({ HashType, Size }) => {
  for (let i = 0; i < setData.length; i++) {
    if (setData[i].hashType == HashType && setData[i].size == Size) {
      return (
        <div>
            <p>Input size: <span>{setData[i].size}</span></p>
            <p>Output: <span>{setData[i].size + " strings"}</span></p>
            <p>Execution time: <span>{setData[i].executionTime}</span></p>
        </div>
        )
      }
    }
}

const Password = ({ HashType, DataType }) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].passwordNumber == DataType) {
        return (
          <div>
              <p>Input size: <span>1</span></p>
              <p>Input: <span>{data[i].passwordNumber}</span></p>
              <p>Output: <span>{HashType == "SHA" ? data[i].hashValueSHA : data[i].hashValueMD5}</span></p>
          </div>
        )
    }
  }
}


const DataDisplay = ({ DataType, HashType, Size }) => {
  if (DataType == "LargeDataset") {
    return <LargeDataset HashType={HashType} Size={Size} />
  } else {
    return <Password HashType={HashType} DataType={DataType} />
  }
}

export default DataDisplay