export function MSM_generator(seed:string, count:number) {
    let numbers: number[] = [];
    for (let i=0; i < count; i++) {
        let seed_ml:number = Math.floor(seed.length / 2);
        let y0 = ((+seed) ** 2).toString();
        let n = (y0.length % 2 === 0) ? y0 : `0${y0}`;
        seed = n.substring((n.length / 2) - seed_ml, (n.length / 2) + seed_ml);
        numbers.push(+`0.${seed}`);
        // numbers.push(+((+`0.${seed}`).toFixed(5)));
    }
    return numbers;
}

export function MPM_generator(seed_1:string, count:number) {
    let numbers: number[] = [];
    let seed_2 = '19'; 
    for (let i=0; i < count; i++) {
        let seed_ml:number = Math.floor(seed_1.length / 2);
        let y0:string = ((+seed_1) * (+seed_2)).toString();
        let n:string = (y0.length % 2 === 0) ? y0 : `0${y0}`;
        seed_1 = seed_2;
        seed_2 = n.substring((n.length / 2) - seed_ml, (n.length / 2) + seed_ml);
        numbers.push(+((+`0.${seed_2}`).toFixed(5)));
    }
    return numbers;
}

export function CM_generator(seed:string, count:number) {
    let numbers: number[] = [];
    for (let i=0; i < count; i++) {
        let seed_ml:number = Math.floor(seed.length / 2);
        let y0:string = ((+seed) * 1664525).toString();
        let n:string = (y0.length % 2 === 0) ? y0 : `0${y0}`;
        seed = n.substring((n.length / 2) - seed_ml, (n.length / 2) + seed_ml);
        numbers.push(+((+`0.${seed}`).toFixed(5)));
    }
    return numbers;
}

export function LC_generator(seed:string, count:number){
    let numbers: number[] = [];
    for (let i=0;i< count;i++){
        seed = (((+seed) * 1103515245 + 12345) % 2147483648).toString();
        numbers.push(+(((+seed) / (2147483648 - 1)).toFixed(5)));
    }
    return numbers;
}

export function MC_generator(seed:string, count:number){
    let numbers: number[] = [];
    for (let i=0;i< count;i++){
        seed = (((+seed) * 1103515245) % 2147483647).toString();
        numbers.push(+(((+seed) / (2147483647 - 1)).toFixed(5)));
    }
    return numbers;
}

export function AC_generator(count:number){
    let seed = Array.from({length: 20}, () => Math.floor(Math.random() * 100000));
    let numbers: number[] = [];
    for (let i = 0 ; i < count ;i++){
        let r = ((seed[seed.length-1] + seed[0]) % 94748);
        seed = seed.slice(1).concat(r);
        numbers.push(+((r/(94748 - 1)).toFixed(5)));
    }
    return numbers;
}

export function QC_generator(seed:string, count:number){
    let numbers: number[] = [];
    for (let i=0;i< count;i++){
        seed = ((((+seed) ** 2 * 94748) + ((+seed) * 89541) + 12345) % 2147483647).toString();
        numbers.push(+(((+seed) / (2147483647 - 1)).toFixed(5)));
    }
    return numbers;
}

export function BBS_generator(seed:string , count:number){
    let numbers: number[] = [];
    let mod:number = 492876847 * 715225739;
    for (let i=0;i< count;i++){
        seed = (((+seed) ** 2) % mod).toString();
        numbers.push(+(((+seed) / (mod - 1)).toFixed(5)));
    }
    return numbers;
}

