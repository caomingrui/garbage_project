import {useStore} from "../../../store/vueStore/store";
import {Store} from "../../../store/vueStore";
import { useGetTime, getTimeUnique } from "../../../utils/hooks";

export const useQueryEvent = () => {
    const time = useGetTime();
    const timeStr = useGetTime(3);

    const data = useStore((store: Store) => {
        const { tabelData, checkTabelData } = store.state;
        return {
            tabelData,
            checkTabelData
        }
    });

    // 处理多列
    function multipleCol<T> (resInd: any, index: number, da: any, i: number = 0) {
        data.tabelData.map((res: typeof data.tabelData) => {
            if (res.key === resInd.key) {

                Object.keys(res).map(list => {
                    if (i === 0) {
                        console.log('11111111111111111111111111111')
                        if (index === 0) {
                            da[list] = res[list];
                            da['ind0'] = 1;
                            da[list + 1] = "";
                            da[list + 2] = "";
                            da['ind' + 1] = "";
                            da['ind' + 2] = "";
                        }

                        if (index === 1) {
                            da[list + '1'] = res[list];
                            da['ind1'] = 2;
                            da[list + 2] = "";
                            da['ind' + 2] = "";
                        }

                        if (index === 2) {
                            da[list + '2'] = res[list];
                            da['ind2'] = 3;
                        }
                    }
                    if ( i !== 0) {
                        if (index > 2) {
                            console.log('222222222222222222222222222222222')
                            if (index%3 === 0) {
                                da[list] = res[list];
                                da['ind0'] = 1;
                                da['ind1'] = "";
                                da['ind2'] = "";
                                da[list + 1] = "";
                                da[list + 2] = "";
                            }

                            if (index%3 === 1) {
                                da[list + 1] = res[list];
                                da['ind1'] = 2;
                                da[list + 2] = "";
                                da['ind2'] = "";
                            }

                            if (index%3 === 2) {
                                da[list + 2] = res[list];
                                da['ind2'] = 3;
                            }
                        }
                    }
                    da['lineTime'] = time;
                    da['orderNo'] = res['orderNo'].length > 10?res['orderNo']: res['orderNo'] + '-' + timeStr;
                });
            }
        });
        return da;
    }


    // 处理waterproof
    function dealWithWater<T> (resInd: any, index: number, da: any, i: number = 0, number: number = 3) {
        console.log(resInd, index);
        data.tabelData.map((res: typeof data.tabelData) => {
            if (res.key === resInd.key) {
                console.log(res);
                Object.keys(res).map(list => {

                    if (i === 0) {
                        console.log('11111111111111111111111111111')
                        if (index === 0) {
                            da[list] = res[list];
                            da["batch"] = resInd.batch;
                            da['ind0'] = 1;
                            da[list + 1] = "";
                            da[list + 2] = "";
                            da['ind' + 1] = "";
                            da['ind' + 2] = "";

                        }

                        if (index === 1) {
                            da[list + '1'] = res[list];
                            da['ind1'] = 2;
                            da[list + 2] = "";
                            da['ind' + 2] = "";
                            da["batch1"] = resInd.batch;

                        }

                        if (number == 3) {
                            if (index === 2) {
                                da[list + '2'] = res[list];
                                da['ind2'] = 3;
                                da["batch2"] = resInd.batch;
                            }
                        }

                    }
                    if ( i !== 0) {
                        if (index > 2) {
                            console.log('222222222222222222222222222222222')
                            if (index%number === 0) {
                                da[list] = res[list];
                                da["batch"] = resInd.batch;
                                da['ind0'] = 1;
                                da['ind1'] = "";
                                da['ind2'] = "";
                                da[list + 1] = "";
                                da[list + 2] = "";
                            }

                            if (index%number === 1) {
                                da[list + 1] = res[list];
                                da['ind1'] = 2;
                                da[list + 2] = "";
                                da['ind2'] = "";
                                da["batch1"] = resInd.batch;
                            }

                            if (index%number === 2) {
                                da[list + 2] = res[list];
                                da['ind2'] = 3;
                                da["batch2"] = resInd.batch;
                            }
                        }
                    }
                    da['lineTime'] = time;
                    da['orderNo'] = res['orderNo'].length > 10?res['orderNo']: res['orderNo'] + '-' + timeStr;
                    da['uuid'] = getTimeUnique();
                });
            }
        });
        return JSON.parse(JSON.stringify(da));
    }

    // 尝试switch
    function switchWorld (resInd: any, index: number, da: any, i: number = 0, number: number = 3) {
        console.log(resInd, index, da);

        data.tabelData.map((res: typeof data.tabelData) => {
            if (res.key === resInd.key) {
                console.log(res);
                Object.keys(res).map(list => {
                    if (i === 0) {
                        console.log('11111111111111111111111111111')
                        if (index === 0) {
                            da[list] = res[list];
                            da["batch"] = resInd.batch;
                            da["groupNum"] = 1 + '组';
                            da['ind0'] = 1;
                            da[list + 1] = "";
                            da[list + 2] = "";
                            da['ind' + 1] = "";
                            da['ind' + 2] = "";
                        }

                        if (index === 1) {
                            // 与上一栏类型一致
                            if (da["type"] == resInd.type) {
                                if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                    da[list] = res[list];
                                    da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<resInd.limit? Number(da["batch"]): resInd.limit));
                                    // da["batch"] = (Number(resInd.batch) + Number(resInd.limit));
                                    da["groupNum"] = 2 + '组';
                                    da['ind0'] = 1;
                                    da[list + 1] = "";
                                    da[list + 2] = "";
                                    da['ind' + 1] = "";
                                    da['ind' + 2] = "";
                                }
                            }
                            else {
                                da[list + '1'] = res[list];
                                da["batch1"] = resInd.batch ;
                                da["groupNum1"] = 1 + '组';
                                da['ind1'] = 2;
                                da[list + 2] = "";
                                da['ind' + 2] = "";
                            }
                        }

                        if (index === 2) {
                            let key = list;
                            // 第二栏存在
                            if (da[list + '1']) {
                                //  与上一栏比较类型
                                if (da["type1"] == resInd.type) {
                                    if ((Number(da["batch1"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        da[list + '1'] = res[list];
                                        da['ind1'] = 24;
                                        da[list + 2] = "";
                                        da['ind' + 2] = "";
                                        // da["batch1"] = (Number(resInd.batch) + Number(da["batch1"]));
                                        da["batch1"] = (Number(resInd.batch) + (Number(da["batch1"])<resInd.limit? Number(da["batch1"]): resInd.limit));
                                        da["groupNum1"] = 2 + '组';
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    }
                                }
                            }
                            else {
                                // 与第一栏栏比较类型
                                if (da["type"] == resInd.type) {
                                    if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
                                        da[list] = res[list];
                                        // da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
                                        da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<(resInd.limit * 2)? Number(da["batch"]): (resInd.limit * 2)));
                                        da["groupNum"] = 3  + '组';
                                        da['ind0'] = 1;
                                        da[list + 1] = "";
                                        da[list + 2] = "";
                                        da['ind' + 1] = "";
                                        da['ind' + 2] = "";
                                    }
                                }
                                // 不同重写第二栏
                                else {
                                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    da[key + '1'] = res[key];
                                    da['ind1'] = 2;
                                    da[list + 2] = "";
                                    da['ind' + 2] = "";
                                    da["batch1"] = resInd.batch ;
                                    da["groupNum1"] = 1  + '组';
                                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                }
                            }
                        }
                    }
                    if ( i !== 0) {
                        if (index > 2) {
                            console.log('222222222222222222222222222222222')
                            if (index%number === 0) {
                                da[list] = res[list];
                                da["batch"] = resInd.batch;
                                da["groupNum"] = 1  + '组';
                                da['ind0'] = 1;
                                da['ind1'] = "";
                                da['ind2'] = "";
                                da[list + 1] = "";
                                da[list + 2] = "";
                            }

                            if (index%number === 1) {
                                // 与上一栏类型一致
                                if (da["type"] == resInd.type) {
                                    console.log('--------------------------', da["batch"], (Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit));
                                    if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                        da[list] = res[list];
                                        // da["batch1"] = (Number(resInd.batch) + resInd.limit);
                                        da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<resInd.limit? Number(da["batch"]): resInd.limit));
                                        da["groupNum"] = 2 + '组';
                                        da['ind0'] = 1;
                                        da[list + 1] = "";
                                        da[list + 2] = "";
                                        da['ind' + 1] = "";
                                        da['ind' + 2] = "";
                                    }
                                }
                                else {
                                    da[list + '1'] = res[list];
                                    da["batch1"] = resInd.batch;
                                    da["groupNum1"] = 1  + '组';
                                    da['ind1'] = 2;
                                    da[list + 2] = "";
                                    da['ind' + 2] = "";
                                }
                            }

                            if (index%number === 2) {
                                let key = list;
                                // 第二栏存在
                                if (da[list + '1']) {
                                    //  与上一栏比较类型
                                    if (da["type1"] == resInd.type) {
                                        if ((Number(resInd.batch) + Number(da["batch1"])) <= ((2) * resInd.limit)) {
                                            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                            da[list + '1'] = res[list];
                                            da['ind1'] = 2;
                                            da[list + 2] = "";
                                            da['ind' + 2] = "";
                                            da["batch1"] = (Number(resInd.batch) + (Number(da["batch1"])<resInd.limit? Number(da["batch1"]): resInd.limit));
                                            da["groupNum1"] = 2 + '组';
                                            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        }
                                    }
                                }
                                else {
                                    // 与第一栏栏比较类型
                                    if (da["type"] == resInd.type) {
                                        if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
                                            da[list] = res[list];
                                            da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<(resInd.limit * 2)? Number(da["batch"]): (resInd.limit * 2)));
                                            da["groupNum"] = 3 + '组';
                                            da['ind0'] = 1;
                                            da[list + 1] = "";
                                            da[list + 2] = "";
                                            da['ind' + 1] = "";
                                            da['ind' + 2] = "";
                                        }
                                    }
                                    // 不同重写第二栏
                                    else {
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        da[key + '1'] = res[key];
                                        da['ind1'] = 2;
                                        da[list + 2] = "";
                                        da['ind' + 2] = "";
                                        da["batch1"] = resInd.batch ;
                                        da["groupNum1"] = 1 + '组';
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    }
                                }
                            }
                        }
                    }
                    console.log("###############################################")
                    da['lineTime'] = time;
                    da['orderNo'] = res['orderNo'].length > 10?res['orderNo']: res['orderNo'] + '-' + timeStr;
                    da['uuid'] = getTimeUnique();
                });
            }
        });

        return JSON.parse(JSON.stringify(da));
    }

    // 傻逼水泥土
    function concreteWorld (resInd: any, index: number, da: any, i: number = 0, number: number = 3) {
        console.log(resInd, index, da);
        // data.tabelData.map((res: typeof data.tabelData) => {
        //     if (res.key === resInd.key) {
        //         console.log(res);
        //         Object.keys(res).map(list => {
        //             if (i === 0) {
        //                 console.log('11111111111111111111111111111')
        //                 if (index === 0) {
        //                     da[list] = res[list];
        //                     da["batch"] = resInd.batch;
        //                     da["groupNum"] = 1 + '组';
        //                     da['ind0'] = 1;
        //                     da[list + 1] = "";
        //                     da[list + 2] = "";
        //                     da['ind' + 1] = "";
        //                     da['ind' + 2] = "";
        //                 }
        //
        //                 if (index === 1) {
        //                     // 与上一栏类型一致
        //                     if (da["maintenance"] == res.maintenance) {
        //                         if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
        //                             da[list] = res[list];
        //                             // da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
        //                             da["batch"] = (Number(resInd.batch) + Number(resInd.limit));
        //                             da["groupNum"] = 2 + '组';
        //                             da['ind0'] = 1;
        //                             da[list + 1] = "";
        //                             da[list + 2] = "";
        //                             da['ind' + 1] = "";
        //                             da['ind' + 2] = "";
        //                         }
        //                     }
        //                     else {
        //                         da[list + '1'] = res[list];
        //                         da["batch1"] = resInd.batch ;
        //                         da["groupNum1"] = 1 + '组';
        //                         da['ind1'] = 2;
        //                         da[list + 2] = "";
        //                         da['ind' + 2] = "";
        //                     }
        //                 }
        //
        //                 if (index === 2) {
        //                     let key = list;
        //                     // 第二栏存在
        //                     if (da[list + '1']) {
        //                         //  与上一栏比较类型
        //                         if (da["maintenance1"] == res.maintenance) {
        //                             if ((Number(da["batch1"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
        //                                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                                 da[list + '1'] = res[list];
        //                                 da['ind1'] = 24;
        //                                 da[list + 2] = "";
        //                                 da['ind' + 2] = "";
        //                                 da["batch1"] = (Number(resInd.batch) + Number(da["batch1"]));
        //                                 da["groupNum1"] = 2 + '组';
        //                                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                             }
        //                         }
        //                     }
        //                     else {
        //                         // 与第一栏栏比较类型
        //                         if (da["maintenance"] == res.maintenance) {
        //                             if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
        //                                 da[list] = res[list];
        //                                 da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
        //                                 da["groupNum"] = 3  + '组';
        //                                 da['ind0'] = 1;
        //                                 da[list + 1] = "";
        //                                 da[list + 2] = "";
        //                                 da['ind' + 1] = "";
        //                                 da['ind' + 2] = "";
        //                             }
        //                         }
        //                         // 不同重写第二栏
        //                         else {
        //                             console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                             da[key + '1'] = res[key];
        //                             da['ind1'] = 2;
        //                             da[list + 2] = "";
        //                             da['ind' + 2] = "";
        //                             da["batch1"] = resInd.batch ;
        //                             da["groupNum1"] = 2  + '组';
        //                             console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                         }
        //                     }
        //                 }
        //             }
        //             if ( i !== 0) {
        //                 if (index > 2) {
        //                     console.log('222222222222222222222222222222222')
        //                     if (index%number === 0) {
        //                         da[list] = res[list];
        //                         da["batch"] = resInd.batch;
        //                         da["groupNum"] = 1  + '组';
        //                         da['ind0'] = 1;
        //                         da['ind1'] = "";
        //                         da['ind2'] = "";
        //                         da[list + 1] = "";
        //                         da[list + 2] = "";
        //                     }
        //
        //                     if (index%number === 1) {
        //                         // 与上一栏类型一致
        //                         if (da["maintenance"] == res.maintenance) {
        //                             console.log('--------------------------', da["batch"], (Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit));
        //                             if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
        //                                 da[list] = res[list];
        //                                 // da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
        //                                 da["batch"] = (Number(resInd.batch) + Number(resInd.limit));
        //                                 da["groupNum"] = 2 + '组';
        //                                 da['ind0'] = 1;
        //                                 da[list + 1] = "";
        //                                 da[list + 2] = "";
        //                                 da['ind' + 1] = "";
        //                                 da['ind' + 2] = "";
        //                             }
        //                         }
        //                         else {
        //                             da[list + '1'] = res[list];
        //                             da["batch1"] = resInd.batch;
        //                             da["groupNum1"] = 1  + '组';
        //                             da['ind1'] = 2;
        //                             da[list + 2] = "";
        //                             da['ind' + 2] = "";
        //                         }
        //                     }
        //
        //                     if (index%number === 2) {
        //                         let key = list;
        //                         // 第二栏存在
        //                         if (da[list + '1']) {
        //                             //  与上一栏比较类型
        //                             if (da["maintenance1"] == res.maintenance) {
        //                                 if ((Number(da["batch1"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
        //                                     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                                     da[list + '1'] = res[list];
        //                                     da['ind1'] = 2;
        //                                     da[list + 2] = "";
        //                                     da['ind' + 2] = "";
        //                                     da["batch1"] = (Number(resInd.batch) + Number(da["batch1"]));
        //                                     da["groupNum1"] = 2 + '组';
        //                                     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                                 }
        //                             }
        //                         }
        //                         else {
        //                             // 与第一栏栏比较类型
        //                             if (da["maintenance"] == res.maintenance) {
        //                                 if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
        //                                     da[list] = res[list];
        //                                     da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
        //                                     da["groupNum"] = 3 + '组';
        //                                     da['ind0'] = 1;
        //                                     da[list + 1] = "";
        //                                     da[list + 2] = "";
        //                                     da['ind' + 1] = "";
        //                                     da['ind' + 2] = "";
        //                                 }
        //                             }
        //                             // 不同重写第二栏
        //                             else {
        //                                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                                 da[key + '1'] = res[key];
        //                                 da['ind1'] = 2;
        //                                 da[list + 2] = "";
        //                                 da['ind' + 2] = "";
        //                                 da["batch1"] = resInd.batch ;
        //                                 da["groupNum1"] = 1 + '组';
        //                                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //             console.log("###############################################")
        //             da['lineTime'] = time;
        //             da['orderNo'] = res['orderNo'].length > 10?res['orderNo']: res['orderNo'] + '-' + timeStr;
        //             da['uuid'] = getTimeUnique();
        //         });
        //     }
        // });

        data.tabelData.map((res: typeof data.tabelData) => {
            if (res.key === resInd.key) {
                console.log(res);
                Object.keys(res).map(list => {
                    if (i === 0) {
                        console.log('11111111111111111111111111111')
                        if (index === 0) {
                            da[list] = res[list];
                            da["batch"] = resInd.batch;
                            da["groupNum"] = 1 + '组';
                            da['ind0'] = 1;
                            da[list + 1] = "";
                            da[list + 2] = "";
                            da['ind' + 1] = "";
                            da['ind' + 2] = "";
                        }

                        if (index === 1) {
                            // 与上一栏类型一致
                            if (da["maintenance"] == res.maintenance) {
                                if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                    da[list] = res[list];
                                    da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<resInd.limit? Number(da["batch"]): resInd.limit));
                                    // da["batch"] = (Number(resInd.batch) + Number(resInd.limit));
                                    da["groupNum"] = 2 + '组';
                                    da['ind0'] = 1;
                                    da[list + 1] = "";
                                    da[list + 2] = "";
                                    da['ind' + 1] = "";
                                    da['ind' + 2] = "";
                                }
                            }
                            else {
                                da[list + '1'] = res[list];
                                da["batch1"] = resInd.batch ;
                                da["groupNum1"] = 1 + '组';
                                da['ind1'] = 2;
                                da[list + 2] = "";
                                da['ind' + 2] = "";
                            }
                        }

                        if (index === 2) {
                            let key = list;
                            // 第二栏存在
                            if (da[list + '1']) {
                                //  与上一栏比较类型
                                if (da["maintenance1"] == res.maintenance) {
                                    if ((Number(da["batch1"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        da[list + '1'] = res[list];
                                        da['ind1'] = 24;
                                        da[list + 2] = "";
                                        da['ind' + 2] = "";
                                        // da["batch1"] = (Number(resInd.batch) + Number(da["batch1"]));
                                        da["batch1"] = (Number(resInd.batch) + (Number(da["batch1"])<resInd.limit? Number(da["batch1"]): resInd.limit));
                                        da["groupNum1"] = 2 + '组';
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    }
                                }
                            }
                            else {
                                // 与第一栏栏比较类型
                                if (da["maintenance"] == res.maintenance) {
                                    if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
                                        da[list] = res[list];
                                        // da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
                                        da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<(resInd.limit * 2)? Number(da["batch"]): (resInd.limit * 2)));
                                        da["groupNum"] = 3  + '组';
                                        da['ind0'] = 1;
                                        da[list + 1] = "";
                                        da[list + 2] = "";
                                        da['ind' + 1] = "";
                                        da['ind' + 2] = "";
                                    }
                                }
                                // 不同重写第二栏
                                else {
                                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    da[key + '1'] = res[key];
                                    da['ind1'] = 2;
                                    da[list + 2] = "";
                                    da['ind' + 2] = "";
                                    da["batch1"] = resInd.batch ;
                                    da["groupNum1"] = 1  + '组';
                                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                }
                            }
                        }
                    }
                    if ( i !== 0) {
                        if (index > 2) {
                            console.log('222222222222222222222222222222222')
                            if (index%number === 0) {
                                da[list] = res[list];
                                da["batch"] = resInd.batch;
                                da["groupNum"] = 1  + '组';
                                da['ind0'] = 1;
                                da['ind1'] = "";
                                da['ind2'] = "";
                                da[list + 1] = "";
                                da[list + 2] = "";
                            }

                            if (index%number === 1) {
                                // 与上一栏类型一致
                                if (da["maintenance"] == res.maintenance) {
                                    console.log('--------------------------', da["batch"], (Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit));
                                    if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                        da[list] = res[list];
                                        // da["batch1"] = (Number(resInd.batch) + resInd.limit);
                                        da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<resInd.limit? Number(da["batch"]): resInd.limit));
                                        da["groupNum"] = 2 + '组';
                                        da['ind0'] = 1;
                                        da[list + 1] = "";
                                        da[list + 2] = "";
                                        da['ind' + 1] = "";
                                        da['ind' + 2] = "";
                                    }
                                }
                                else {
                                    da[list + '1'] = res[list];
                                    da["batch1"] = resInd.batch;
                                    da["groupNum1"] = 1  + '组';
                                    da['ind1'] = 2;
                                    da[list + 2] = "";
                                    da['ind' + 2] = "";
                                }
                            }

                            if (index%number === 2) {
                                let key = list;
                                // 第二栏存在
                                if (da[list + '1']) {
                                    //  与上一栏比较类型
                                    if (da["maintenance1"] == res.maintenance) {
                                        if ((Number(resInd.batch) + Number(da["batch1"])) <= ((2) * resInd.limit)) {
                                            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                            da[list + '1'] = res[list];
                                            da['ind1'] = 2;
                                            da[list + 2] = "";
                                            da['ind' + 2] = "";
                                            da["batch1"] = (Number(resInd.batch) + (Number(da["batch1"])<resInd.limit? Number(da["batch1"]): resInd.limit));
                                            da["groupNum1"] = 2 + '组';
                                            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        }
                                    }
                                }
                                else {
                                    // 与第一栏栏比较类型
                                    if (da["maintenance"] == res.maintenance) {
                                        if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
                                            da[list] = res[list];
                                            da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<(resInd.limit * 2)? Number(da["batch"]): (resInd.limit * 2)));
                                            da["groupNum"] = 3 + '组';
                                            da['ind0'] = 1;
                                            da[list + 1] = "";
                                            da[list + 2] = "";
                                            da['ind' + 1] = "";
                                            da['ind' + 2] = "";
                                        }
                                    }
                                    // 不同重写第二栏
                                    else {
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        da[key + '1'] = res[key];
                                        da['ind1'] = 2;
                                        da[list + 2] = "";
                                        da['ind' + 2] = "";
                                        da["batch1"] = resInd.batch ;
                                        da["groupNum1"] = 1 + '组';
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    }
                                }
                            }
                        }
                    }
                    console.log("###############################################")
                    da['lineTime'] = time;
                    da['orderNo'] = res['orderNo'].length > 10?res['orderNo']: res['orderNo'] + '-' + timeStr;
                    da['uuid'] = getTimeUnique();
                });
            }
        });

        return JSON.parse(JSON.stringify(da));
    }

    // 砂浆
    function mortarWorld (resInd: any, index: number, da: any, i: number = 0, number: number = 3) {
        console.log(resInd, index, da);

        data.tabelData.map((res: typeof data.tabelData) => {
            if (res.key === resInd.key) {
                console.log(res);
                Object.keys(res).map(list => {
                    if (i === 0) {
                        console.log('11111111111111111111111111111')
                        if (index === 0) {
                            da[list] = res[list];
                            da["batch"] = resInd.batch;
                            da["groupNum"] = 1 + '组';
                            da['ind0'] = 1;
                            da[list + 1] = "";
                            da[list + 2] = "";
                            da['ind' + 1] = "";
                            da['ind' + 2] = "";
                        }

                        if (index === 1) {
                            // 与上一栏类型一致
                            if (da["sampleName"] == res.sampleName && da["type"] == res.type) {
                                if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                    da[list] = res[list];
                                    da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<resInd.limit? Number(da["batch"]): resInd.limit));
                                    // da["batch"] = (Number(resInd.batch) + Number(resInd.limit));
                                    da["groupNum"] = 2 + '组';
                                    da['ind0'] = 1;
                                    da[list + 1] = "";
                                    da[list + 2] = "";
                                    da['ind' + 1] = "";
                                    da['ind' + 2] = "";
                                }
                            }
                            else {
                                da[list + '1'] = res[list];
                                da["batch1"] = resInd.batch ;
                                da["groupNum1"] = 1 + '组';
                                da['ind1'] = 2;
                                da[list + 2] = "";
                                da['ind' + 2] = "";
                            }
                        }

                        if (index === 2) {
                            let key = list;
                            // 第二栏存在
                            if (da[list + '1']) {
                                //  与上一栏比较类型
                                if (da["sampleName1"] == res.sampleName && da["type1"] == res.type) {
                                    if ((Number(da["batch1"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        da[list + '1'] = res[list];
                                        da['ind1'] = 24;
                                        da[list + 2] = "";
                                        da['ind' + 2] = "";
                                        // da["batch1"] = (Number(resInd.batch) + Number(da["batch1"]));
                                        da["batch1"] = (Number(resInd.batch) + (Number(da["batch1"])<resInd.limit? Number(da["batch1"]): resInd.limit));
                                        da["groupNum1"] = 2 + '组';
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    }
                                }
                            }
                            else {
                                // 与第一栏栏比较类型
                                if (da["sampleName"] == res.sampleName && da["type"] == res.type) {
                                    if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
                                        da[list] = res[list];
                                        // da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
                                        da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<(resInd.limit * 2)? Number(da["batch"]): (resInd.limit * 2)));
                                        da["groupNum"] = 3  + '组';
                                        da['ind0'] = 1;
                                        da[list + 1] = "";
                                        da[list + 2] = "";
                                        da['ind' + 1] = "";
                                        da['ind' + 2] = "";
                                    }
                                }
                                // 不同重写第二栏
                                else {
                                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    da[key + '1'] = res[key];
                                    da['ind1'] = 2;
                                    da[list + 2] = "";
                                    da['ind' + 2] = "";
                                    da["batch1"] = resInd.batch ;
                                    da["groupNum1"] = 1  + '组';
                                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                }
                            }
                        }
                    }
                    if ( i !== 0) {
                        if (index > 2) {
                            console.log('222222222222222222222222222222222')
                            if (index%number === 0) {
                                da[list] = res[list];
                                da["batch"] = resInd.batch;
                                da["groupNum"] = 1  + '组';
                                da['ind0'] = 1;
                                da['ind1'] = "";
                                da['ind2'] = "";
                                da[list + 1] = "";
                                da[list + 2] = "";
                            }

                            if (index%number === 1) {
                                // 与上一栏类型一致
                                if (da["sampleName"] == res.sampleName && da["type"] == res.type) {
                                    console.log('--------------------------', da["batch"], (Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit));
                                    if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                        da[list] = res[list];
                                        // da["batch1"] = (Number(resInd.batch) + resInd.limit);
                                        da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<resInd.limit? Number(da["batch"]): resInd.limit));
                                        da["groupNum"] = 2 + '组';
                                        da['ind0'] = 1;
                                        da[list + 1] = "";
                                        da[list + 2] = "";
                                        da['ind' + 1] = "";
                                        da['ind' + 2] = "";
                                    }
                                }
                                else {
                                    da[list + '1'] = res[list];
                                    da["batch1"] = resInd.batch;
                                    da["groupNum1"] = 1  + '组';
                                    da['ind1'] = 2;
                                    da[list + 2] = "";
                                    da['ind' + 2] = "";
                                }
                            }

                            if (index%number === 2) {
                                let key = list;
                                // 第二栏存在
                                if (da[list + '1']) {
                                    //  与上一栏比较类型
                                    if (da["sampleName1"] == res.sampleName && da["type1"] == res.type) {
                                        if ((Number(resInd.batch) + Number(da["batch1"])) <= ((2) * resInd.limit)) {
                                            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                            da[list + '1'] = res[list];
                                            da['ind1'] = 2;
                                            da[list + 2] = "";
                                            da['ind' + 2] = "";
                                            da["batch1"] = (Number(resInd.batch) + (Number(da["batch1"])<resInd.limit? Number(da["batch1"]): resInd.limit));
                                            da["groupNum1"] = 2 + '组';
                                            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        }
                                    }
                                }
                                else {
                                    // 与第一栏栏比较类型
                                    if (da["sampleName"] == res.sampleName && da["type"] == res.type) {
                                        if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
                                            da[list] = res[list];
                                            da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<(resInd.limit * 2)? Number(da["batch"]): (resInd.limit * 2)));
                                            da["groupNum"] = 3 + '组';
                                            da['ind0'] = 1;
                                            da[list + 1] = "";
                                            da[list + 2] = "";
                                            da['ind' + 1] = "";
                                            da['ind' + 2] = "";
                                        }
                                    }
                                    // 不同重写第二栏
                                    else {
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        da[key + '1'] = res[key];
                                        da['ind1'] = 2;
                                        da[list + 2] = "";
                                        da['ind' + 2] = "";
                                        da["batch1"] = resInd.batch ;
                                        da["groupNum1"] = 1 + '组';
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    }
                                }
                            }
                        }
                    }
                    console.log("###############################################")
                    da['lineTime'] = time;
                    da['orderNo'] = res['orderNo'].length > 10?res['orderNo']: res['orderNo'] + '-' + timeStr;
                    da['uuid'] = getTimeUnique();
                });
            }
        });

        // data.tabelData.map((res: typeof data.tabelData) => {
        //     if (res.key === resInd.key) {
        //         console.log(res);
        //         Object.keys(res).map(list => {
        //             if (i === 0) {
        //                 console.log('11111111111111111111111111111')
        //                 if (index === 0) {
        //                     da[list] = res[list];
        //                     da["batch"] = resInd.batch;
        //                     da["groupNum"] = 1 + '组';
        //                     da['ind0'] = 1;
        //                     da[list + 1] = "";
        //                     da[list + 2] = "";
        //                     da['ind' + 1] = "";
        //                     da['ind' + 2] = "";
        //                 }
        //
        //                 if (index === 1) {
        //                     // 与上一栏类型一致
        //                     if (da["sampleName"] == res.sampleName) {
        //                         if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
        //                             da[list] = res[list];
        //                             // da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
        //                             da["batch"] = (Number(resInd.batch) + Number(resInd.limit));
        //                             da["groupNum"] = 2 + '组';
        //                             da['ind0'] = 1;
        //                             da[list + 1] = "";
        //                             da[list + 2] = "";
        //                             da['ind' + 1] = "";
        //                             da['ind' + 2] = "";
        //                         }
        //                     }
        //                     else {
        //                         da[list + '1'] = res[list];
        //                         da["batch1"] = resInd.batch ;
        //                         da["groupNum1"] = 1 + '组';
        //                         da['ind1'] = 2;
        //                         da[list + 2] = "";
        //                         da['ind' + 2] = "";
        //                     }
        //                 }
        //
        //                 if (index === 2) {
        //                     let key = list;
        //                     // 第二栏存在
        //                     if (da[list + '1']) {
        //                         //  与上一栏比较类型
        //                         if (da["sampleName1"] == res.sampleName) {
        //                             if ((Number(da["batch1"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
        //                                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                                 da[list + '1'] = res[list];
        //                                 da['ind1'] = 24;
        //                                 da[list + 2] = "";
        //                                 da['ind' + 2] = "";
        //                                 da["batch1"] = (Number(resInd.batch) + Number(da["batch1"]));
        //                                 da["groupNum1"] = 2 + '组';
        //                                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                             }
        //                         }
        //                     }
        //                     else {
        //                         // 与第一栏栏比较类型
        //                         if (da["sampleName"] == res.sampleName) {
        //                             if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
        //                                 da[list] = res[list];
        //                                 da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
        //                                 da["groupNum"] = 3  + '组';
        //                                 da['ind0'] = 1;
        //                                 da[list + 1] = "";
        //                                 da[list + 2] = "";
        //                                 da['ind' + 1] = "";
        //                                 da['ind' + 2] = "";
        //                             }
        //                         }
        //                         // 不同重写第二栏
        //                         else {
        //                             console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                             da[key + '1'] = res[key];
        //                             da['ind1'] = 2;
        //                             da[list + 2] = "";
        //                             da['ind' + 2] = "";
        //                             da["batch1"] = resInd.batch ;
        //                             da["groupNum1"] = 2  + '组';
        //                             console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                         }
        //                     }
        //                 }
        //             }
        //             if ( i !== 0) {
        //                 if (index > 2) {
        //                     console.log('222222222222222222222222222222222')
        //                     if (index%number === 0) {
        //                         da[list] = res[list];
        //                         da["batch"] = resInd.batch;
        //                         da["groupNum"] = 1  + '组';
        //                         da['ind0'] = 1;
        //                         da['ind1'] = "";
        //                         da['ind2'] = "";
        //                         da[list + 1] = "";
        //                         da[list + 2] = "";
        //                     }
        //
        //                     if (index%number === 1) {
        //                         // 与上一栏类型一致
        //                         if (da["sampleName"] == res.sampleName) {
        //                             console.log('--------------------------', da["batch"], (Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit));
        //                             if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
        //                                 da[list] = res[list];
        //                                 // da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
        //                                 da["batch"] = (Number(resInd.batch) + Number(resInd.limit));
        //                                 da["groupNum"] = 2 + '组';
        //                                 da['ind0'] = 1;
        //                                 da[list + 1] = "";
        //                                 da[list + 2] = "";
        //                                 da['ind' + 1] = "";
        //                                 da['ind' + 2] = "";
        //                             }
        //                         }
        //                         else {
        //                             da[list + '1'] = res[list];
        //                             da["batch1"] = resInd.batch;
        //                             da["groupNum1"] = 1  + '组';
        //                             da['ind1'] = 2;
        //                             da[list + 2] = "";
        //                             da['ind' + 2] = "";
        //                         }
        //                     }
        //
        //                     if (index%number === 2) {
        //                         let key = list;
        //                         // 第二栏存在
        //                         if (da[list + '1']) {
        //                             //  与上一栏比较类型
        //                             if (da["sampleName1"] == res.sampleName) {
        //                                 if ((Number(da["batch1"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
        //                                     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                                     da[list + '1'] = res[list];
        //                                     da['ind1'] = 2;
        //                                     da[list + 2] = "";
        //                                     da['ind' + 2] = "";
        //                                     da["batch1"] = (Number(resInd.batch) + Number(da["batch1"]));
        //                                     da["groupNum1"] = 2 + '组';
        //                                     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                                 }
        //                             }
        //                         }
        //                         else {
        //                             // 与第一栏栏比较类型
        //                             if (da["sampleName"] == res.sampleName) {
        //                                 if ((Number(da["batch"]) + Number(resInd.batch)) <= ((3) * resInd.limit)) {
        //                                     da[list] = res[list];
        //                                     da["batch"] = (Number(resInd.batch) + Number(da["batch"]));
        //                                     da["groupNum"] = 3 + '组';
        //                                     da['ind0'] = 1;
        //                                     da[list + 1] = "";
        //                                     da[list + 2] = "";
        //                                     da['ind' + 1] = "";
        //                                     da['ind' + 2] = "";
        //                                 }
        //                             }
        //                             // 不同重写第二栏
        //                             else {
        //                                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                                 da[key + '1'] = res[key];
        //                                 da['ind1'] = 2;
        //                                 da[list + 2] = "";
        //                                 da['ind' + 2] = "";
        //                                 da["batch1"] = resInd.batch ;
        //                                 da["groupNum1"] = 1 + '组';
        //                                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //             console.log("###############################################")
        //             da['lineTime'] = time;
        //             da['orderNo'] = res['orderNo'].length > 10?res['orderNo']: res['orderNo'] + '-' + timeStr;
        //             da['uuid'] = getTimeUnique();
        //         });
        //     }
        // });

        return JSON.parse(JSON.stringify(da));
    }
    
    function permeabilityWorld(resInd: any, index: number, da: any, i: number = 0, number: number = 3) {
        console.log(resInd)
        data.tabelData.map((res: typeof data.tabelData) => {
            if (res.key === resInd.key) {
                console.log(res);
                Object.keys(res).map(list => {
                    if (i === 0) {
                        console.log('11111111111111111111111111111')
                        if (index === 0) {
                            da[list] = res[list];
                            da["batch"] = resInd.batch;
                            da["groupNum"] = 1 + 'a组';
                            da['ind0'] = 1;
                            da[list + 1] = "";
                            da[list + 2] = "";
                            da['ind' + 1] = "";
                            da['ind' + 2] = "";
                        }

                        if (index === 1) {
                            // 与上一栏类型一致
                            if (da["maintenance"] == res.maintenance) {
                                if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                    da[list] = res[list];
                                    da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<resInd.limit? Number(da["batch"]): resInd.limit));
                                    da["groupNum"] = 2 + '组';
                                    da['ind0'] = 1;
                                    da[list + 1] = "";
                                    da[list + 2] = "";
                                    da['ind' + 1] = "";
                                    da['ind' + 2] = "";
                                }
                            }
                            else {
                                da[list + '1'] = res[list];
                                da["batch1"] = resInd.batch ;
                                da["groupNum1"] = 1 + 's组';
                                da['ind1'] = 2;
                                da[list + 2] = "";
                                da['ind' + 2] = "";
                            }
                        }
                    }
                    if (i !== 0) {
                        if (index > 1) {
                            console.log('222222222222222222222222222222222')
                            if (index%number === 0) {
                                da[list] = res[list];
                                da["batch"] = resInd.batch;
                                da["a"] = index;
                                da["groupNum"] = 1  + 'd组';
                                da['ind0'] = 1;
                                da['ind1'] = "";
                                da['ind2'] = "";
                                da[list + 1] = "";
                                da[list + 2] = "";
                            }

                            if (index%number === 1) {
                                // 与上一栏类型一致
                                if (da["maintenance"] == res.maintenance) {
                                    console.log('--------------------------', da["batch"], (Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit));
                                    if ((Number(da["batch"]) + Number(resInd.batch)) <= ((2) * resInd.limit)) {
                                        da[list] = res[list];
                                        // da["batch1"] = (Number(resInd.batch) + resInd.limit);
                                        da["batch"] = (Number(resInd.batch) + (Number(da["batch"])<resInd.limit? Number(da["batch"]): resInd.limit));
                                        da["groupNum"] = 2 + '组';
                                        da['ind0'] = 1;
                                        da[list + 1] = "";
                                        da[list + 2] = "";
                                        da['ind' + 1] = "";
                                        da['ind' + 2] = "";
                                    }
                                }
                                else {
                                    da[list + '1'] = res[list];
                                    da["batch1"] = resInd.batch;
                                    da["groupNum1"] = 1  + 'g组';
                                    da['ind1'] = 2;
                                    da[list + 2] = "";
                                    da['ind' + 2] = "";
                                }
                            }
                        }
                    }
                    console.log("###############################################")
                    da['lineTime'] = time;
                    da['orderNo'] = res['orderNo'].length > 10?res['orderNo']: res['orderNo'] + '-' + timeStr;
                    da['uuid'] = getTimeUnique();
                });
            }
        });
        return JSON.parse(JSON.stringify(da));
    }
    return {
        multipleCol,
        dealWithWater,
        switchWorld,
        concreteWorld,
        mortarWorld,
        permeabilityWorld
    }
};
