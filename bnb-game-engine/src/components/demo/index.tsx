import { client, selectSp } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ReedSolomon } from '@bnb-chain/reed-solomon';

export const Demo = () => {
  const { address, connector } = useAccount();
  const [greenfieldURL, setGreenfieldURL] = useState('');
  const [info, setInfo] = useState<{
    bucketName: string;
    objectName: string;
    file: File | null;
  }>({
    bucketName: 'hackathon',
    objectName: '',
    file: null
  });
  const [txnHash, setTxnHash] = useState('');

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">
            BNB Game Engine
          </h1>
        </div>
      </section>

      <div className='box'>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Bucket</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={info.bucketName}
                  placeholder="bucket name"
                  onChange={(e) => {
                    setInfo({ ...info, bucketName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <button
            className={'button is-primary'}
            onClick={async () => {
              if (!address) return;

              const spInfo = await selectSp();
              console.log('spInfo', spInfo);

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              try {
                const createBucketTx = await client.bucket.createBucket(
                  {
                    bucketName: info.bucketName,
                    creator: address,
                    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
                    chargedReadQuota: '0',
                    spInfo: {
                      primarySpAddress: spInfo.primarySpAddress,
                    },
                    paymentAddress: address,
                  },
                  {
                    type: 'EDDSA',
                    domain: window.location.origin,
                    seed: offChainData.seedString,
                    address,
                  },
                );

                const simulateInfo = await createBucketTx.simulate({
                  denom: 'BNB',
                });

                console.log('simulateInfo', simulateInfo);

                const res = await createBucketTx.broadcast({
                  denom: 'BNB',
                  gasLimit: Number(simulateInfo?.gasLimit),
                  gasPrice: simulateInfo?.gasPrice || '5000000000',
                  payer: address,
                  granter: '',
                });

                if (res.code === 0) {
                  alert('success');
                }
              } catch (err) {
                console.log(typeof err)
                if (err instanceof Error) {
                  alert(err.message);
                }
                if (err && typeof err === 'object') {
                  alert(JSON.stringify(err))
                }
              }

            }}
          >
            Create Bucket Tx
          </button>
        </div>
      </div>

      <div className='box'>
        {/* <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Object</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={info.objectName}
                  placeholder="object name"
                  onChange={(e) => {
                    setInfo({ ...info, objectName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div> */}

        <div className="field is-horizontal">
          <div className="file">
            <label className="file-label">
              <input className="file-input" type="file" name="resume" onChange={(e) => {
                if (e.target.files) {
                  console.log("e.target.files[0]", e.target.files[0]);
                  console.log("e.target.files[0].name", e.target.files[0].name);
                  setInfo({
                    ...info,
                    file: e.target.files[0],
                    objectName: e.target.files[0].name
                  })
                }
              }} />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">
                  Choose a file…
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* create object */}
        <div className="field">
          <button
            className="button is-primary"
            onClick={async () => {
              if (!address || !info.file) return;

              const spInfo = await selectSp();
              console.log('spInfo', spInfo);

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              const rs = new ReedSolomon();
              const fileBytes = await info.file.arrayBuffer();
              const expectCheckSums = rs.encode(new Uint8Array(fileBytes));

              try {
                const createObjectTx = await client.object.createObject(
                  {
                    bucketName: info.bucketName,
                    objectName: info.objectName,
                    creator: address,
                    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
                    fileType: info.file.type,
                    redundancyType: 'REDUNDANCY_EC_TYPE',
                    contentLength: fileBytes.byteLength,
                    expectCheckSums: expectCheckSums,
                  },
                  {
                    type: 'EDDSA',
                    domain: window.location.origin,
                    seed: offChainData.seedString,
                    address,
                  },
                );

                const simulateInfo = await createObjectTx.simulate({
                  denom: 'BNB',
                });

                console.log('simulateInfo', simulateInfo);

                const res = await createObjectTx.broadcast({
                  denom: 'BNB',
                  gasLimit: Number(simulateInfo?.gasLimit),
                  gasPrice: simulateInfo?.gasPrice || '5000000000',
                  payer: address,
                  granter: '',
                });

                if (res.code === 0) {
                  setTxnHash(res.transactionHash);
                  alert('create object success');
                }
              } catch (err) {
                console.log(typeof err)
                if (err instanceof Error) {
                  alert(err.message);
                }
                if (err && typeof err === 'object') {
                  alert(JSON.stringify(err))
                }
              }
            }}
          >
            Create Object Tx
          </button>
        </div>

        {/* upload */}
        <div className='field'>
          <button
            disabled={txnHash === ''}
            className="button is-primary"
            onClick={async () => {
              if (!address || !info.file) return;

              const spInfo = await selectSp();
              console.log('spInfo', spInfo);

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              const uploadRes = await client.object.uploadObject(
                {
                  bucketName: info.bucketName,
                  objectName: info.objectName,
                  body: info.file,
                  txnHash: txnHash,
                },
                {
                  type: 'EDDSA',
                  domain: window.location.origin,
                  seed: offChainData.seedString,
                  address,
                },
              );

              if (uploadRes.code === 0) {
                alert('upload success');
                const res = await client.object.listObjects({
                  bucketName: info.bucketName,
                  endpoint: 'https://gnfd-testnet-sp1.nodereal.io',
                });
                console.log('listObjects', res);
                const res2 = await client.object.getObjectPreviewUrl(
                  {
                    bucketName: info.bucketName,
                    objectName: info.objectName,
                    queryMap: {
                      view: '1',
                      'X-Gnfd-User-Address': address,
                      'X-Gnfd-App-Domain': window.location.origin,
                      'X-Gnfd-Expiry-Timestamp': '2023-09-03T09%3A23%3A39Z',
                    },
                  },
                  {
                    type: 'EDDSA',
                    address,
                    domain: window.location.origin,
                    seed: offChainData.seedString,
                  },
                );
                console.log('getObjectPreviewUrl', res2);
                setGreenfieldURL(res2);
              }
            }}
          >
            Confirm
          </button>
        </div>

        {/* Download */}
        {/* <div className='field'>
          <button
            className="button is-primary"
            onClick={async () => {
              if (!address) return;

              const spInfo = await selectSp();
              console.log('spInfo', spInfo);

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              const res = await client.object.downloadFile(
                {
                  bucketName: info.bucketName,
                  objectName: info.objectName,
                },
                {
                  type: 'EDDSA',
                  address,
                  domain: window.location.origin,
                  seed: offChainData.seedString,
                },
              );

              console.log(res);
            }}
          >
            Download
          </button>
        </div> */}
        {/* create input filed with*/}
        {
          greenfieldURL &&
          <>

            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={greenfieldURL}
                  placeholder="Greenfield URL"
                  readOnly
                />
              </div>
            </div>
            <div className='field'>
              <button
                className="button is-primary"
                onClick={() => {
                  navigator.clipboard.writeText(greenfieldURL);
                  alert('Copied to clipboard');
                }}
              >
                Copy to Clipboard
              </button>

            </div>
          </>
        }
      </div>
    </>
  );
};