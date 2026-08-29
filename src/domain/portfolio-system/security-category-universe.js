/**
 * Phase 1 approved browseable security universe.
 *
 * Membership makes a security available for inspection. It does not make
 * the security a current or hypothetical holding and does not determine a
 * portfolio-fit outcome.
 */

const CATEGORY_SECURITY_IDS = Object.freeze({
  'global-equity': Object.freeze(["vt","acwi","spgm","ioo","urth","veu","cwi"]),
  'broad-us-equity': Object.freeze(["vti","itot","schb","sptm","iwv","vone","vv","schx","iwb","spy","ivv","voo","splg"]),
  'broad-international-equity': Object.freeze(["vxus","ixus","veu","acwx","cwi","schf","spdw","vea","iefa"]),
  'developed-international-equity': Object.freeze(["vea","iefa","schf","spdw","efa","idev","fndf","efv","efg"]),
  'emerging-market-equity': Object.freeze(["vwo","iemg","eem","sche","spem","emxc","fnde","dgs","dem","avem"]),
  'small-cap-equity': Object.freeze(["vb","ijr","iwm","scha","spsm","vtwo","vioo","iscb","fnda"]),
  'growth-oriented-equity': Object.freeze(["vug","schg","iwf","spyg","ivw","voog","mgk","qqqm","qqq","iusg","vong"]),
  'income-equity': Object.freeze(["schd","vym","hdv","dgro","dvy","sdy","nobl","dgrw","spyd","fdvv","vig"]),
  'diversified-factor-equity': Object.freeze(["dynf","lrgf","gslc","fndx","fndb","jpme","omfl","rous","deus","avus"]),
  'quality-factor-equity': Object.freeze(["qual","sphq","jqua","dgrw","qgro","ousa","qdf","fqal"]),
  'value-factor-equity': Object.freeze(["vtv","iwd","iusv","schv","spyv","rpv","vlue","avlv","fval","dflv"]),
  'small-value-equity': Object.freeze(["avuv","vbr","ijs","slyv","viov","dfsv","iscv","rwj"]),
  'style-equity': Object.freeze(["vug","vtv","vo","vb","iwf","iwd","iwp","iws","iwo","iwn","schg","schv","schm","scha","spyg","spyv"]),
  'sector-equity': Object.freeze(["xlk","xlv","xlf","xly","xlp","xle","xli","xlb","xlu","xlre","xlc","vgt","vht","vfh","vcr","vdc","vde","vis","vaw","vpu","vnq","iyw","iyh","iyf","iyc","iyk","iye","iyj","iym","idu"]),
  'thematic-equity': Object.freeze(["arkk","botz","robo","irbo","aiq","cibr","hack","icln","tan","fan","pbw","driv","idrv","lit","clou","finx","gnom","pave","ifra","skyy"]),
  'high-quality-bonds': Object.freeze(["bnd","agg","schz","iusb","govt","biv","ief","vgit","vcsh","vcit","lqd","mbb","bndx"]),
  'government-bonds': Object.freeze(["govt","shy","iei","ief","tlh","tlt","vgsh","vgit","vglt","scho","schr","edv","zroz"]),
  'short-government-securities': Object.freeze(["sgov","bil","shv","vgsh","scho","shy","gbil","tbil","clip","usfr","tflo"]),
  'short-duration-bonds': Object.freeze(["bsv","spsb","vcsh","igsb","shy","vgsh","scho","jpst","mint","near","flot","flrn","icsh"]),
  'investment-grade-credit': Object.freeze(["lqd","vcit","vcsh","igsb","igib","iglb","spib","splb","usig","corp","qlta"]),
  'inflation-protected-bonds': Object.freeze(["tip","schp","vtip","stip","spip","ltpz","rinf","ivol"]),
  'cash-equivalent': Object.freeze(["sgov","bil","shv","usfr","tflo","tbil","gbil","clip","jpst","mint","icsh"]),
  'real-assets': Object.freeze(["vnq","schh","usrt","iyr","xlre","reet","gldm","iau","gld","sgol","pdbc","dbc","comt","gsg","pave","ifra","igf","rwo"]),
  'alternative-strategy': Object.freeze(["dbmf","kmlm","cta","fmf","qai","btal","mna","rpar","aoa","aor","aom","aok","ntsx","swan"]),
  'tactical-fund': Object.freeze([]),
  'broad-preference-fund': Object.freeze([]),
  'selected-equity': Object.freeze([]),
  'income-opportunity': Object.freeze(["pff","pgx","vrp","pffd","hylb","hyg","jnk","angl","faln","bkln","srln","jepi","jepq","divo"]),
});

export const SECURITY_CATEGORY_UNIVERSE = Object.freeze(
  Object.entries(CATEGORY_SECURITY_IDS).map(
    ([categoryId, securityIds]) => Object.freeze({
      categoryId,
      securityIds
    })
  )
);

export const SECURITY_CATEGORY_IDS = Object.freeze(
  SECURITY_CATEGORY_UNIVERSE.map(({ categoryId }) => categoryId)
);

export const PHASE_1_APPROVED_SECURITY_IDS = Object.freeze(
  [...new Set(
    SECURITY_CATEGORY_UNIVERSE.flatMap(({ securityIds }) => securityIds)
  )]
);

const CATEGORY_BY_ID = new Map(
  SECURITY_CATEGORY_UNIVERSE.map(
    (category) => [category.categoryId, category]
  )
);

const CATEGORIES_BY_SECURITY_ID = new Map();

for (const { categoryId, securityIds } of SECURITY_CATEGORY_UNIVERSE) {
  for (const securityId of securityIds) {
    const categoryIds =
      CATEGORIES_BY_SECURITY_ID.get(securityId) ?? [];

    CATEGORIES_BY_SECURITY_ID.set(
      securityId,
      [...categoryIds, categoryId]
    );
  }
}

export function getSecurityCategory(categoryId) {
  return CATEGORY_BY_ID.get(categoryId) ?? null;
}

export function getSecurityCategories(securityId) {
  const normalizedId =
    typeof securityId === 'string'
      ? securityId.toLowerCase()
      : '';

  return Object.freeze([
    ...(CATEGORIES_BY_SECURITY_ID.get(normalizedId) ?? [])
  ]);
}
