/**
 * 셰도잉 경고용 Python 빌트인 명단.
 *
 * 자주 변수로 잘못 쓰여 함정을 만드는 빌트인 함수/타입 위주.
 * (전체 빌트인 다 넣으면 지나치게 시끄러워서 핵심만)
 */

export const PYTHON_BUILTINS = new Set<string>([
  // 자주 변수로 오용되는 빌트인 함수
  "abs", "all", "any", "bin", "bool", "callable", "chr", "complex",
  "dict", "dir", "divmod", "enumerate", "eval", "exec", "exit", "filter",
  "float", "format", "frozenset", "getattr", "hasattr", "hash", "help",
  "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len",
  "list", "map", "max", "min", "next", "object", "oct", "open", "ord",
  "pow", "print", "property", "range", "repr", "reversed", "round", "set",
  "setattr", "slice", "sorted", "str", "sum", "tuple", "type", "vars",
  "zip",

  // 자주 헷갈리는 키워드성 식별자
  "True", "False", "None",
]);

/**
 * 추천 대체 이름 (충돌 시 사용자에게 제안).
 */
export function suggestAlternativeNames(builtin: string): string[] {
  const map: Record<string, string[]> = {
    sum: ["total", "subtotal", "accumulator"],
    max: ["max_value", "largest", "biggest", "highest"],
    min: ["min_value", "smallest", "lowest"],
    list: ["items", "values", "data", "elements"],
    dict: ["mapping", "table", "lookup", "config"],
    set: ["items_set", "unique_items", "collection"],
    str: ["text", "message", "label", "name"],
    int: ["number", "count", "value"],
    float: ["number", "amount", "ratio"],
    bool: ["flag", "is_active", "enabled"],
    type: ["kind", "category", "variant"],
    id: ["identifier", "key", "user_id"],
    input: ["user_input", "answer", "value"],
    len: ["length", "count", "size"],
    range: ["sequence", "indices"],
    map: ["mapping", "transformer"],
    filter: ["predicate", "selector"],
    next: ["following", "upcoming"],
    open: ["opener", "open_file"],
    print: ["display", "show"],
    object: ["obj", "instance", "entity"],
  };
  return map[builtin] ?? [`my_${builtin}`, `${builtin}_value`];
}
