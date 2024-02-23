// @ts-nocheck
import { client, selectSp } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { GlobalContext } from '../../engine/GlobalContext.jsx';
import * as THREE from 'three'

export const Demo = () => {
  const { address, connector } = useAccount();
  const [greenfieldURL, setGreenfieldURL] = useState('');
  const [objectList, setObjectList] = useState([]);
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
  const { state, dispatch } = useContext(GlobalContext);
  const { assetMaster } = state

  const fetchAssets = async () => {
    if (!address) return;
    const spInfo = await selectSp();
    console.log('spInfo', spInfo);

    const provider = await connector?.getProvider();
    const offChainData = await getOffchainAuthKeys(address, provider);
    if (!offChainData) {
      alert('No offchain, please create offchain pairs first');
      return;
    }

    const res = await client.object.listObjects({
      bucketName: info.bucketName,
      endpoint: 'https://gnfd-testnet-sp1.nodereal.io',
    });
    console.log('listObjects all', res);
    if (res.body?.GfSpListObjectsByBucketNameResponse?.Objects) {
      setObjectList(res.body?.GfSpListObjectsByBucketNameResponse?.Objects);

      dispatch({
        type: "SET_ASSETS",
        payload: {
          assetMaster: res.body?.GfSpListObjectsByBucketNameResponse?.Objects
        }
      })

    }
  };

  return (
    <>
      <div className="accordion-item standard-fbutton">
        <h2 className="accordion-header">
          <button className="accordion-button standard-background collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSeven" aria-expanded="false" aria-controls="flush-collapseSeven">
            <span className="me-2 align-middle bi bi-bucket-fill text-success"></span>
            
            BnB Greenfield Assets
          </button>
        </h2>
        <div id="flush-collapseSeven" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <div className="accordion-body">
            <div className='row m-0 p-0 mb-2'>
              <div className='box mt-2 shadow-sm border border-success'>
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

                <div className="field text-end">
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
                    Connect to Greenfield
                  </button>
                </div>
              </div>

              <div className='box shadow-sm border border-success'>
                <div className="field is-horizontal">
                  <div className="file w-100">
                    <label className="file-label">
                      <input className="file-input w-100" type="file" name="resume" onChange={(e) => {
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
                          Choose a GLB model
                        </span>
                      </span>
                    </label>
                  </div>
                  <button
                    className="button is-primary me-1"
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
                    Upload
                  </button>
                </div>

                {/* create object */}
                <div className="field d-flex justify-content-between">


                  <button
                    disabled={txnHash === ''}
                    className="button is-primary me-1"
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

                        navigator.clipboard.writeText(res2);

                        dispatch({
                          type: "ADD_OBJECT",
                          payload: {
                            link: res2,
                            assetIdentifier: info.objectName.concat('_').concat(Date.now().toString()),
                            assetLink: res2,
                            position: new THREE.Vector3(0, 0, 0),
                            quaternion: new THREE.Quaternion(0, 0, 0, 0),
                            scale: new THREE.Vector3(1, 1, 1),
                            worldMatrix: new THREE.Matrix4(),
                            collision: 'no', // no, yes, box, hull, trimesh (yes=box)
                            fixed: false // true, false
                          }
                        })
                      }
                    }}
                  >
                    Add to Scene
                  </button>

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
                  {/* {
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
        } */}
                  {/* Fetch Assets */}
                  <button
                    className="button is-primary"
                    onClick={fetchAssets}
                  >
                    My Assets
                  </button>
                  {/* {objectList.length} */}
                  {/* <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}>

                    {
                      objectList.map((object, index) => {
                        let bucketName = object["ObjectInfo"]["BucketName"];
                        let objectName = object["ObjectInfo"]["ObjectName"];
                        let objectNameWithTimeStamp = objectName.split('.')[0].concat('_').concat(Date.now().toString())
                        let owner = object["ObjectInfo"]["Owner"];
                        let url = `https://gnfd-testnet-sp2.nodereal.io/download/${bucketName}/${objectName}`;
                        if (owner === address || true)
                          return (
                            <button key={index} onClick={
                              (e) => {
                                navigator.clipboard.writeText(url);
                                dispatch({
                                  type: "ADD_OBJECT",
                                  payload: {
                                    link: url,
                                    assetIdentifier: objectNameWithTimeStamp,
                                    assetLink: url,
                                    position: new THREE.Vector3(0, 0, 0),
                                    quaternion: new THREE.Quaternion(0, 0, 0, 0),
                                    scale: new THREE.Vector3(1, 1, 1),
                                    worldMatrix: new THREE.Matrix4(),
                                    collision: 'no', // no, yes, box, hull, trimesh (yes=box)
                                    fixed: false // true, false
                                  }
                                })
                                console.log("dispatch objectName", objectNameWithTimeStamp);
                              }
                            }
                            >
                              {objectName}
                            </button>
                          );
                      })
                    }
                  </div> */}
                </div>
              </div >
            </div>
          </div>
        </div>
      </div>
    </>
  );
};