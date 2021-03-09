import { jStat as st } from 'jstat';

export function Exponential(m:number, r:number[]) {
    return Array.from(r,x => (-m)*Math.log(1-x));
}

export function Uniform(a:number, b:number, r:number[]) {
    return Array.from(r,x=> a+((b-a)*x));
}

export function Empirical(r:number[]) {
    let res:number[]=[];
    for (let i=0;i<r.length;i++){
        res[i] = (r[i]> 0.5) ? 2*r[i] : Math.sqrt(2*r[i]);
    }
    return res;
}

export function Poisson(m:number, r:number[]) {
    let res:number[]=[],
        a:number[]=Array.from({length:25},(_,i)=> st.poisson.cdf(i,m));
    for(let i=0;i<r.length;i++){
        if(r[i]>0 && r[i]<a[0]) res[i] = 0;
        else{
            for(let j=1; j<25;j++){
                if(r[i]>=a[j-1] && r[i]<a[j]){
                    res[i] = j; 
                    break;
                }
            }
        } 
    }
    return res;
}

export function Bernoulli(p:number, r:number[]) {
    let res:number[]=[];
    for (let i=0;i<r.length;i++){
        res[i] = (r[i]>0 && r[i]<(1-p)) ? 0 : 1;
    }
    return res;
}

export function noDensity(h:number[][],r:number[]){
    let res:number[]=[];
    let val = h.map(v => v[0]);
    let prob = h.map(v => v[1]);
    let ac = prob.map((sum => value => sum += value)(0));
    for(let i=0;i<r.length;i++){
        if(r[i]>=0 && r[i]<ac[0]) res[i] = val[0];
        else{
            for(let j=1; j<val.length;j++){
                if(r[i]>=ac[j-1] && r[i]<ac[j]){
                    res[i] = val[j]; 
                    break;
                }
            }
        } 
    }
    return res; 
}

export function Earlang(k:number, m:number, r:number[]) {
    let res:number[]=[];
    for(let i=0;i<r.length;i+=k){
        let x = r.slice(i,k+i).reduce((a,b,i)=>(i==1) ? (1-a)*(1-b) : a*(1-b));
        res[i/k]=(-(1/k)*m)*Math.log(x);
    }
    return res;
}

export function Normal(m:number, de:number, r:number[]) {
    let res:number[]=[];
    let chunk = [...Array(r.length / 12)].map(_ => r.splice(0,12));
    for(let i=0;i<chunk.length;i++){
        res[i] = ((chunk[i].reduce((a,b) => a+b))-6)*de+m;
    }
    return res;
}

export function Binomial(n2:number, p:number, r:number[]) {
    let res:number[]=[],
        n1 = r.length/n2;
    for (let i=0;i<n1;i++){
        let s:number[]=[];
        for(let j=0;j<n2;j++){
            s[j] = (r[n1*i+j]>0 && r[n1*i+j]<(1-p)) ? 0 : 1;
        }
        res[i]= s.reduce((a,b) => a+b);
    }
    return res;
}