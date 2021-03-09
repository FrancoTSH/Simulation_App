import * as j from 'jerzy';
import { jStat as st } from 'jstat';
import * as prng from './prnGenerators';
import * as t from './tests';
import * as vg from './varGenerators';

function isNormal(arr:number[]){
    let v = new j.Vector(arr);
    let res = j.Normality.shapiroWilk(v);
    return (res.p >= 0.05) ? true : false;
}

function getConfidenceInterval(num:number[]){
    let li:number,ls:number;
    if (isNormal(num)) {
        li = st.mean(num) - ((st.stdev(num)/Math.sqrt(num.length)) * st.studentt.inv(0.95,num.length-1)); 
        ls = st.mean(num) + ((st.stdev(num)/Math.sqrt(num.length)) * st.studentt.inv(0.95,num.length-1));
    } else{
        li = st.mean(num) - (st.stdev(num)/Math.sqrt(num.length * 0.05)); 
        ls = st.mean(num) + (st.stdev(num)/Math.sqrt(num.length * 0.05));
    }
    return [li,ls];
}

function getValidPRN(n:number){
    let prn:number[], r:number;
    do {
        let testResults:boolean[] = [];
        prn = prng.LC_generator((Date.now() | 0).toString(),n);
        testResults.push(t.M_test(prn),t.V_test(prn),t.chisquare_test(prn),t.ks_test(prn),t.ud_test(prn),t.udm_test(prn),t.gap_test(prn));
        r = testResults.filter(x => x).length;
    } while (r < 7);
    return prn;
}

export default function InventoryModel(rn:number,s:number,S:number){
    let results:number[]=[],
        resultsDetails:{dia:number[],addedItems:number[],initialInv:number[],demand:number[], finalInv:number[],orderT:number[],orderCost:number[],holdingCost:number[],shortageCost:number[],totalCost:number[],avgCost:number[]}[]=[];
    for (let j = 0; j < rn; j++) {
         let demand = vg.Poisson(7,getValidPRN(365));
         let leadTime = vg.noDensity([[2,0.3],[3,0.4],[4,0.3]],getValidPRN(365));
         let initialInv:number[]=[],finalInv:number[]=[],order:any[][]=[],totalCost:number[]=[],avgCost:number[]=[],orderIndex:number,orderExists = false,orderCost:number[]=[],holdingCost:number[]=[],shortageCost:number[]=[],addedItems:number[]=[];
         demand.forEach((v,i)=>{
            if (orderIndex) {
                if (order[orderIndex][1] === 0 && orderExists) {
                    addedItems.push(order[orderIndex][0]);
                    initialInv[i] = finalInv[i-1] + order[orderIndex][0];
                    orderExists = false;
                    orderIndex = undefined;
                } else{
                    order[orderIndex][1]--;
                    addedItems.push(0);
                    initialInv[i] = (finalInv[i-1]);
                }
            } else{
                addedItems.push(0);
                initialInv[i] = (i == 0) ? 55 : (finalInv[i-1]);
            }
            if (initialInv[i] < s && !orderExists) {
                orderIndex = i;
                order.push([(S - initialInv[i]),leadTime[i],leadTime[i]]);
                orderExists = true;
                orderCost[i] = 500 + (1100 * order[i][0]);
            } else{
                order.push([0,null]);
                orderCost[i] = 0;
            }
            finalInv[i] = (v > initialInv[i]) ? 0 : initialInv[i] - v;
            holdingCost[i] = 50 * st.mean([initialInv[i],finalInv[i]]);
            shortageCost[i] = (v > initialInv[i]) ? 120 * (v - initialInv[i]) : 0;
            totalCost[i] = orderCost[i] + holdingCost[i] + shortageCost[i];
            avgCost[i] = (totalCost.reduce((a,b) => a+b))/totalCost.length;
         })
         results[j] = avgCost[avgCost.length-1];
         let orderTime = order.map(el=>el[2]);
         resultsDetails[j] = {
             dia: Array.from({length:365},(_,i)=> i+1),
             addedItems:addedItems,
             initialInv:initialInv,
             demand: demand,
             finalInv:finalInv,
             orderT:orderTime,
             orderCost:orderCost,
             holdingCost:holdingCost,
             shortageCost:shortageCost,
             totalCost:totalCost,
             avgCost:avgCost
         }
    }
    return {
        resultsDetails : resultsDetails,
        repMean : results,
        confInt : getConfidenceInterval(results)
    }
}