import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/clients/supabaseClient';

type DescriptionsCacheType = Record<number, string>;

// Inline the descriptions data to avoid file system issues in deployment
const descriptions: DescriptionsCacheType = {
  '1': 'Description 1 6nf chr zni x33h y7ai iac',
  '2': 'Description 2 2x6 fr4 ejw 74rj 1fo eel qr5 795',
  '3': 'Description 3 6ry f6x mpm bku fbs m9 dd9 c3n 87e i2h r6y',
  '4': 'Description 4 kpx upu 8ip 3ag',
  '5': 'Description 5 5bq 7s7 xnw 1dui ztm uypg tj2 05g m6kf ljd s25 ngai',
  '6': 'Description 6 xgr 60sj yig',
  '7': 'Description 7 qw9 k39l svai 3er id7 jdp vj2 yb6f',
  '8': 'Description 8 3xpj ixz kh9 09s',
  '9': 'Description 9 azhg vmag df9 65qh dqd 88b q5n pul 5p7',
  '10': 'Description 10 ucm h5n gyh usd 9we jw3 41ml',
  '11': 'Description 11 eky 13q',
  '12': 'Description 12 o15 q2o l2r owy b2zl',
  '13': 'Description 13 li3 h5k m3e k1n 0n2 jjwl zsj 28h e67 kseg cxm',
  '14': 'Description 14 r2og l1yj 4gu cln gq1 nch',
  '15': 'Description 15 8ffg pt3 sgj u9t r4d h0m 44m d94 xd5 lga m25 i26 1u6k em h5u yo6f z2i',
  '16': 'Description 16 cyih 8v5 t54i 9q5 66a edz kfb opz',
  '17': 'Description 17 4ux dg2',
  '18': 'Description 18 rl4 5a4 m3u 819 dpj p2ej',
  '19': 'Description 19 dfa 0qyh 4b3 41e ge9 3xbl p1t www ow xu4 kmr yq4 5qm cebl 7r3 kz7g',
  '20': 'Description 20 w9ej kdt j9l ets 6ka 75w 15l t6s 2usk eqv n1x mfa jkj zo7 g1o',
  '21': 'Description 21 s4d 9mr s1q qnd qgo aze 3ogi 3uij ml7h dmc tyr 1ki y1rh 1gr u4a x53',
  '22': 'Description 22 ok5 vb1 08m ejv 0ur itff q83 d2j fel no7 qlc u5 fl t1z',
  '23': 'Description 23 yk9 vfi gdk',
  '24': 'Description 24 17o r6z sao 3ms mc xsyi oil rei xpn djb vb7 toe n7z y8v',
  '25': 'Description 25 lqt bms 73l em8 r02 e4ef jw3 g1r vpqj 0kb blt',
  '26': 'Description 26 0qw ui5 40z',
  '27': 'Description 27 m6u l4r oqb 9fm l9ii tkbf mz3 i68k 6zq vgm',
  '28': 'Description 28 jwm 0tz 4nb',
  '29': 'Description 29 utg 611k yan wdz c5x q7e 5c4 q0z z3m zd8 m1nf v0a 2z5',
  '30': 'Description 30 o2b 6nj e6qg oo3 9me 5a4 d2x vx8 2nu 8fy pac',
  '31': 'Description 31 u0x xry 45b aftl hft jos dfy 8su 05cf kh3 vc8 cz5l tqy 42v 7yek 4nb',
  '32': 'Description 32 o9s d46 snw 0xi 17e ov d2k',
  '33': 'Description 33 90d s7x tg6 dcvf fhe 009 39tj ofl f1j h8q y99 39cf e92 4ro',
  '34': 'Description 34 mvkj kns bpw pu8 run n4ej 4av ytik 0kp 506 1aa ivm',
  '35': 'Description 35 hsq jqd 19v unrh ilk dyxl k03',
  '36': 'Description 36 tmwl p9u lzq u7 qa9 fi3 1kd nf6',
  '37': 'Description 37 g5q nql mkek c33h mc6 dmw 7ac iky 8nu 9gg q65 n74j',
  '38': 'Description 38 cr1 kxt 4us revk meo',
  '39': 'Description 39 k33 pex yb4 mqn 6q8 2jx xvw 3qg sn5 mey 9kv p11 lez h8c',
  '40': 'Description 40 qys xkn 8ce hyuj 1hs 87v f7q e71 qlb wro 13h nqq blfl qi h99',
  '41': 'Description 41 eem 9ml lbgk 8kd ttl asz h8u 47w bn4',
  '42': 'Description 42 xv9 2jf 4qb 3tq vflg li5l zej fcd rwu mkag sml',
  '43': 'Description 43 9ecf w0z 3er',
  '44': 'Description 44 lap 6o6 magg bwh n0t jqz l5k v2g q3w 9oph 3vp pvd hpy',
  '45': 'Description 45 k2s 5dn tu1 jfq z7cj ebc 2sj 9kx 7vrg dhzh z0lg 3ag kqh',
  '46': 'Description 46 sy8 cr7 fba 6bd dmi u8e dxw gjv pl3 y9ff ur2 6bx z8ej ilk',
  '47': 'Description 47 8ie rll xzj ssv sq3 ew3 qkv 7wy gxn 7er hfy ge9 5bck iax',
  '48': 'Description 48 wlx c1g iey uoz muq faa aiph 6gk kjlf 8f l75 ra2 ugn i1n yz7 j1t 7ssl',
  '49': 'Description 49 wgzh m0h j5rh rnj sw4 i5k jcu b0dj',
  '50': 'Description 50 ddz lla m0h c2h k76 dpr sx5 jdsh nbj 26w c8v da3 dkp zoug',
  '51': 'Description 51 h0e 7xp 4jz ov2 t7t sjc z9o wc2 xm2 ye6 6d9 f49 1qq xgj iz5 tu5f',
  '52': 'Description 52 czx tm5 psc ka4 gua h3ag kcj 7zw udg',
  '53': 'Description 53 4mu 5t9 o9z 7eo ep6 7oz 8on jby sxf 9sv yia cgy vqg 3inl 1l3 xdg',
  '54': 'Description 54 6ru dee bzi 58ih w8kl xss',
  '55': 'Description 55 gbu jac y7w 6o8 uta ter bsy jmy 074 kou',
  '56': 'Description 56 rsw 626 7c yb 0p8j lvj ar9 vly l7x udah h5h blj z4ll 2jw aos',
  '57': 'Description 57 k04h o6y 8tz 5ge qcrf',
  '58': 'Description 58 mdj ld1',
  '59': 'Description 59 rne ryv 5qt xxd by3 fjl ain s6ii lg4 0gi mhr z5w 7jz',
  '60': 'Description 60 qyj e1xj 51u x3x tiel 79c 4ak b5ii is7 370l fcp coa j9zh j22',
  '61': 'Description 61 5wl skt don 92s re7 s3a p6d avu d0o zapl sxe 7b bwk 4rt a3s 6xq guw',
  '62': 'Description 62 urr gdx isok nzx',
  '63': 'Description 63 5uu zori zy5g 9d0j 89cg izjh xc9 cds xwk 1ne nke eil 6pu qbe 0h8 tvw is9',
  '64': 'Description 64 jd5 1mb 1a4',
  '65': 'Description 65 78x v9d d1d 0z2h lc3',
  '66': 'Description 66 70u sbrk madk r0a 9wv znw qcr 3rr 1nx',
  '67': 'Description 67 y94 b91 bz4 auc yqo 9bn 947 mnbf 2h2 nph 3xp amq',
  '68': 'Description 68 y6k iyt cyuj r0v gavl pbpf rhf wnu',
  '69': 'Description 69 dls o5 zf5 kz8 hnm',
  '70': 'Description 70 f8qh b20j qm5 qj5 ktx ar6',
  '71': 'Description 71 ijy gnsj q5o tghf co4 w48 ypb',
  '72': 'Description 72 4jtj 7om f34 qra 927 nqyg g5y',
  '73': 'Description 73 bmy hbg 5u2 zvw 7qk j6nf 0bt z18 n42g wwn kyi g87 kxi 3d3f 5h3',
  '74': 'Description 74 59x 075 mbkj e4o sv4 e3m 3e4 utu wex c11 8d2 m29 xlm 10xl',
  '75': 'Description 75 n7gk fcu ypc mze vgyi 6z lln mtq n82k ysk igi mrr sst ds4 xvo',
  '76': 'Description 76 15y k15 cbwh s81 vzj',
  '77': 'Description 77 kvg 7or 4aui qn pvp s6h g2',
  '78': 'Description 78 00e b58 6d9 tpv',
  '79': 'Description 79 6bg yef oxh djc 9fv 95p 4wp 0gy 1cr yby nr6',
  '80': 'Description 80 z7l t54 x7x 1u5 8w7 etd 7h6 xrn lw6k nn6 7mdh',
  '81': 'Description 81 wqe 5orh xvf grpf mqe 2we 07j bi6 nf9 4fm mwv f6v',
  '82': 'Description 82 2q4 fmy 2xv 2xa rm9',
  '83': 'Description 83 ledh gci e6jj gie 6k1 zdkj tu5 743 71x 38h',
  '84': 'Description 84 9ga sux qv7 gf9 rj4 7sh lhq',
  '85': 'Description 85 voq m11j h6x nrq cmki th5 hes',
  '86': 'Description 86 3qzj rf5 pxp 1iz ghj ltfg eh8 j35j aixl 3mf',
  '87': 'Description 87 3juh zru rcpf erv vnwg rqj fls ax4 sbu hff x4e',
  '88': 'Description 88 zbb ego d2w 0i gsw h4w ijhk a2x 7ku pet',
  '89': 'Description 89 st3 7mn wck 6clf sy9 svdg ln6 jnu 2mi f6tl wx6 s6s 0buf',
  '90': 'Description 90 fa7 c7fh eq0k oir yg9 xq2 5vp s1xi s3n d8a s0h bgkl',
  '91': 'Description 91 lj7 4zy q66 8na f1e nvj acc 5j6 bi4f 8ci bo5 3ti wmd 2im k1q mys',
  '92': 'Description 92 6xgl ofgi 2hi aya 27z',
  '93': 'Description 93 myx 6de 6gy wws snsj 14c rz5 uah b0v ng6 491 jih',
  '94': 'Description 94 dm ob6i t3e u7nk 7qb oyp fbi y2v iey zqi tdd 55 ngkf',
  '95': 'Description 95 7ww q9m w4n 0gy',
  '96': 'Description 96 f9jj 05zi',
  '97': 'Description 97 tlh ngl gcvl j79 hs2 lcb 5s3 uipg eor',
  '98': 'Description 98 sej sqvk ur5 raug 16j ogi bwp mbbj 5is 6qg',
  '99': 'Description 99 o2n sr3 gih dgs q18f tsqf ln 3iq ojx',
  '100':
    'Description 100 v48 edw rdo 60d tam ghs qih jd8 fto 2r4 gyk h6g d22f cbuj asx'
};

export async function GET({ params }) {
  const { id } = params;

  console.log(`Fetching moment with id: ${id}`);

  // Fetch from Supabase
  const { data, error } = await supabase
    .from('moments')
    .select('description, short_id')
    .eq('short_id', id)
    .single();

  if (error) {
    console.error('Error fetching moment:', error);
    throw error(404, 'Description not found');
  }

  if (!data || !data.description) {
    console.log(`No moment found with short_id: ${id}`);
    throw error(404, 'Description not found');
  }

  console.log(`Found moment: ${data.description}`);
  return json({ short_id: id, description: data.description });
}
