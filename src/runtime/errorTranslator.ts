/**
 * Python 에러 메시지 친절 번역기.
 *
 * Pyodide가 던지는 에러 텍스트(traceback 포함)를 받아서
 * 입문자가 이해할 수 있는 한국어 설명과 해결 힌트로 변환한다.
 *
 * 전략: 전체 traceback 텍스트의 마지막 "ErrorName: message" 라인을
 *       정규식으로 파싱해서 타입별 번역 반환.
 */

export interface TranslatedError {
  /** 시각적 아이콘 */
  emoji: string;
  /** 에러 종류 제목 (한국어) */
  title: string;
  /** 이게 무슨 뜻인지 입문자에게 설명 */
  explanation: string;
  /** 해결 힌트 (시도해볼 것들) */
  hints: string[];
  /** 파싱한 마지막 에러 라인 원본 — "상세 보기"에서 사용 */
  originalLine: string;
}

/**
 * Traceback 문자열에서 마지막 에러 라인을 파싱해 번역 결과 반환.
 * 파싱 실패 또는 지원 안 하는 에러 타입이면 null.
 */
export function translateError(errorText: string): TranslatedError | null {
  if (!errorText) return null;

  // 마지막 비어있지 않은 줄을 찾는다
  const lines = errorText.trim().split("\n");
  let lastLine = "";
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i].trim();
    if (l) {
      lastLine = l;
      break;
    }
  }
  if (!lastLine) return null;

  // "ErrorName: message" 패턴
  const match = lastLine.match(/^([A-Za-z]+(?:Error|Exception|Warning)):\s*(.*)$/);
  if (!match) return null;

  const [, errorType, errorMessage] = match;

  switch (errorType) {
    // ─────────────────────────────────────────────
    // NameError: 이름 못 찾음
    // ─────────────────────────────────────────────
    case "NameError": {
      const nameMatch = errorMessage.match(/name '([^']+)' is not defined/);
      const name = nameMatch?.[1] ?? "이 이름";
      return {
        emoji: "🔍",
        title: "이름을 찾을 수 없어요",
        explanation: `Python이 \`${name}\` 이라는 이름을 아직 모르고 있어요. 사용하려면 먼저 만들어야 해요.`,
        hints: [
          `오타가 없는지 확인해보세요 (대소문자 구분!)`,
          `변수라면 \`${name} = 어떤값\` 처럼 먼저 만들어야 해요`,
          `문자열(글자)이라면 따옴표로 감싸야 해요: \`"${name}"\``,
          `함수라면 \`def ${name}():\` 처럼 먼저 정의해야 해요`,
        ],
        originalLine: lastLine,
      };
    }

    // ─────────────────────────────────────────────
    // SyntaxError: 문법
    // ─────────────────────────────────────────────
    case "SyntaxError": {
      if (errorMessage.includes("EOL while scanning string literal") ||
          errorMessage.includes("unterminated string literal")) {
        return {
          emoji: "💬",
          title: "닫지 않은 따옴표",
          explanation: "문자열을 여는 따옴표는 있는데 닫는 따옴표가 없어요.",
          hints: [
            `\`"안녕"\` 처럼 양쪽에 따옴표가 있어야 해요`,
            "큰따옴표로 열었으면 큰따옴표로 닫고, 작은따옴표로 열었으면 작은따옴표로 닫으세요",
          ],
          originalLine: lastLine,
        };
      }
      if (errorMessage.includes("'(' was never closed") ||
          errorMessage.includes("unexpected EOF")) {
        return {
          emoji: "🧮",
          title: "닫지 않은 괄호",
          explanation: "여는 괄호는 있는데 닫는 괄호가 없어요.",
          hints: [
            "`(`, `[`, `{` 의 개수만큼 `)`, `]`, `}` 가 있어야 해요",
            `예: \`print("안녕")\` 에서 괄호가 짝이 맞는지 확인해보세요`,
          ],
          originalLine: lastLine,
        };
      }
      return {
        emoji: "📝",
        title: "문법이 올바르지 않아요",
        explanation: "Python이 코드를 이해하지 못했어요. 어딘가에 오타나 문법 실수가 있어요.",
        hints: [
          "괄호 `()`, `[]`, `{}` 가 열고 닫혔는지 확인하세요",
          `따옴표 \`" "\` 가 짝이 맞는지 확인하세요`,
          "`if`, `for`, `def`, `while` 같은 문장 끝에 콜론 `:` 이 있는지 확인하세요",
          "등호(`=`)와 같다(`==`)를 헷갈리지 않았는지 보세요",
        ],
        originalLine: lastLine,
      };
    }

    // ─────────────────────────────────────────────
    // IndentationError: 들여쓰기
    // ─────────────────────────────────────────────
    case "IndentationError": {
      if (errorMessage.includes("expected an indented block")) {
        return {
          emoji: "↦",
          title: "들여쓰기가 필요해요",
          explanation: "`if`, `for`, `while`, `def` 같은 문장 다음 줄은 들여쓰기(보통 공백 4칸)가 있어야 해요.",
          hints: [
            "다음 줄 맨 앞에 공백 4칸을 넣어보세요",
            "Tab 키를 누르면 자동으로 들여쓰기 돼요",
            `예: \`if x > 0:\\n    print("양수")\``,
          ],
          originalLine: lastLine,
        };
      }
      if (errorMessage.includes("unexpected indent")) {
        return {
          emoji: "↤",
          title: "예상치 못한 들여쓰기",
          explanation: "들여쓰기가 있으면 안 되는 곳에 공백이 있어요.",
          hints: [
            "줄 맨 앞의 공백을 지워보세요",
            "이전 줄에 `:` (콜론)이 없는데 들여쓰기를 했는지 확인하세요",
          ],
          originalLine: lastLine,
        };
      }
      return {
        emoji: "📐",
        title: "들여쓰기가 일관되지 않아요",
        explanation: "같은 블록 안의 줄들은 동일한 칸수만큼 들여써야 해요.",
        hints: [
          "탭과 공백을 섞지 마세요 — 공백 4칸으로 통일하는 게 관례예요",
          "같은 들여쓰기 수준의 줄들이 정확히 같은 칸수로 시작하는지 확인하세요",
        ],
        originalLine: lastLine,
      };
    }

    // ─────────────────────────────────────────────
    // TypeError
    // ─────────────────────────────────────────────
    case "TypeError": {
      if (
        errorMessage.includes("unsupported operand type") ||
        errorMessage.includes("can only concatenate") ||
        errorMessage.includes("must be str, not")
      ) {
        return {
          emoji: "🔀",
          title: "서로 다른 종류의 값을 섞어 쓸 수 없어요",
          explanation: "예를 들어 숫자와 글자를 `+` 로 합치려면 한쪽을 변환해야 해요.",
          hints: [
            `숫자 → 글자: \`str(42)\` 를 쓰면 \`"42"\` 가 돼요`,
            `글자 → 숫자: \`int("42")\` 를 쓰면 \`42\` 가 돼요`,
            `편한 방법 — f-string: \`f"나이: {age}세"\``,
          ],
          originalLine: lastLine,
        };
      }
      if (errorMessage.includes("missing") && errorMessage.includes("required positional argument")) {
        return {
          emoji: "🎯",
          title: "함수에 필요한 값이 빠졌어요",
          explanation: "이 함수는 특정 값을 받아야 하는데 그게 없어요.",
          hints: [
            "함수 괄호 안에 필요한 값을 넣어보세요",
            "함수 정의를 보고 어떤 값이 필요한지 확인하세요",
          ],
          originalLine: lastLine,
        };
      }
      if (errorMessage.includes("object is not callable")) {
        // 어떤 타입이 호출됐는지 추출 (예: "'int' object is not callable" → "int")
        const typeMatch = errorMessage.match(/'(\w+)' object is not callable/);
        const objType = typeMatch?.[1] ?? "값";
        return {
          emoji: "📞",
          title: "함수처럼 호출할 수 없는 값이에요",
          explanation:
            `이 자리는 함수여야 하는데 \`${objType}\` 타입의 값이 들어있어요. ` +
            `**아마 같은 이름의 변수가 함수(또는 빌트인)를 덮어썼을 가능성이 큽니다.**`,
          hints: [
            `예: 어딘가에서 \`max = 50\` 같은 코드를 실행한 적 있나요? 그 후엔 \`max([1,2,3])\` 이 안 돼요.`,
            `먼저 그 변수 이름을 다른 것으로 바꾸세요 (예: \`max\` → \`max_value\`).`,
            `**이름만 바꿔도 안 고쳐지면**: 헤더의 \`🔄 런타임\` 버튼으로 재시작하세요. 이전 셰도잉이 메모리에 남아 있어요.`,
          ],
          originalLine: lastLine,
        };
      }
      return {
        emoji: "⚠️",
        title: "타입 관련 문제",
        explanation: "값의 종류(타입)가 기대한 것과 달라요.",
        hints: [
          "값이 숫자인지 글자인지 리스트인지 확인해보세요",
          "`type(변수)` 를 출력해보면 타입을 알 수 있어요",
        ],
        originalLine: lastLine,
      };
    }

    // ─────────────────────────────────────────────
    // ZeroDivisionError
    // ─────────────────────────────────────────────
    case "ZeroDivisionError":
      return {
        emoji: "➗",
        title: "0으로 나눌 수 없어요",
        explanation: "수학에서와 마찬가지로 어떤 수를 0으로 나누는 건 정의되지 않아요.",
        hints: [
          "나누기 전에 나누는 수가 0이 아닌지 확인하세요",
          `예: \`if y != 0: result = x / y\``,
        ],
        originalLine: lastLine,
      };

    // ─────────────────────────────────────────────
    // IndexError
    // ─────────────────────────────────────────────
    case "IndexError":
      return {
        emoji: "📑",
        title: "리스트(또는 문자열)의 범위를 벗어났어요",
        explanation: "리스트에 없는 위치를 접근하려고 했어요. **Python은 0부터 세요** — 첫 번째 요소는 `[0]`, 두 번째는 `[1]` 이에요.",
        hints: [
          "리스트 길이는 `len(my_list)` 로 확인하세요",
          "예를 들어 길이가 3인 리스트는 인덱스 0, 1, 2 만 가능해요 (3은 불가)",
          "마지막 요소는 `my_list[-1]` 로 접근할 수 있어요",
        ],
        originalLine: lastLine,
      };

    // ─────────────────────────────────────────────
    // KeyError
    // ─────────────────────────────────────────────
    case "KeyError":
      return {
        emoji: "🔑",
        title: "딕셔너리에 해당 키가 없어요",
        explanation: "찾으려는 키(key)가 딕셔너리에 존재하지 않아요.",
        hints: [
          "`my_dict.keys()` 로 어떤 키들이 있는지 확인해보세요",
          "없을 때 기본값을 쓰려면: `my_dict.get(key, 기본값)`",
          "키가 있는지 확인: `if key in my_dict:`",
        ],
        originalLine: lastLine,
      };

    // ─────────────────────────────────────────────
    // AttributeError
    // ─────────────────────────────────────────────
    case "AttributeError": {
      const attrMatch = errorMessage.match(/'([\w.]+)' object has no attribute '(\w+)'/);
      if (attrMatch) {
        const [, objType, attr] = attrMatch;
        return {
          emoji: "🧩",
          title: "이 값에는 그런 기능이 없어요",
          explanation: `\`${objType}\` 타입에는 \`${attr}\` 이라는 속성이나 메서드가 없어요.`,
          hints: [
            "메서드 이름에 오타가 없는지 확인하세요",
            `올바른 타입인지 확인하세요 — 리스트의 메서드를 문자열에 쓰려고 했을 수 있어요`,
            `\`dir(변수)\` 를 출력해보면 사용 가능한 메서드 목록이 나와요`,
            `**이전 셀에서 같은 이름 변수를 만들어 덮어쓴 건 아닌가요?** 그럴 땐 헤더 \`🔄 런타임\` 으로 재시작하세요.`,
          ],
          originalLine: lastLine,
        };
      }
      return {
        emoji: "🧩",
        title: "없는 속성이나 메서드를 호출했어요",
        explanation: errorMessage,
        hints: [
          "값의 타입과 사용 가능한 기능을 확인해보세요",
          `이전 셀에서 변수가 함수를 덮어썼다면 \`🔄 런타임\` 재시작이 필요해요.`,
        ],
        originalLine: lastLine,
      };
    }

    // ─────────────────────────────────────────────
    // ModuleNotFoundError / ImportError
    // ─────────────────────────────────────────────
    case "ModuleNotFoundError":
    case "ImportError": {
      const modMatch = errorMessage.match(/No module named '([^']+)'/);
      const mod = modMatch?.[1] ?? "";
      const rootMod = mod.split(".")[0]; // sklearn.datasets → sklearn

      // Pyodide repodata 에 있는 대표 패키지
      const pyodideBundled = new Set([
        "numpy", "pandas", "scipy", "scikit-learn", "sklearn",
        "matplotlib", "sympy", "statsmodels", "pillow", "PIL",
        "lxml", "beautifulsoup4", "bs4", "networkx",
      ]);
      const isBundled = pyodideBundled.has(rootMod);

      const baseExpl = mod
        ? `\`${mod}\` 모듈이 현재 환경에서 사용 가능하지 않아요.`
        : "불러오려는 모듈을 찾을 수 없어요.";

      return {
        emoji: "📦",
        title: "모듈을 찾을 수 없어요",
        explanation: isBundled
          ? `${baseExpl} 이 모듈은 Pyodide에서 지원되지만, 자동 로드에 실패한 것 같아요. 한 번 더 ▶ 실행을 눌러 보세요.`
          : `${baseExpl} 브라우저 Python(Pyodide)에는 일부 모듈만 포함돼 있어요.`,
        hints: isBundled
          ? [
              "한 번 더 **▶ 실행** 눌러 보세요 — 패키지 다운로드가 완료됐다면 이번엔 성공할 수 있어요",
              "네트워크 연결을 확인하세요 (Pyodide가 CDN에서 패키지를 받아옵니다)",
              `같은 코드가 계속 실패하면 헤더의 **🔄 런타임** 버튼으로 초기화 후 재시도`,
            ]
          : [
              "모듈 이름에 오타가 없는지 확인하세요 (대소문자 포함)",
              "브라우저 Python에는 일부 모듈만 내장돼 있어요",
              `필요하면 \`import micropip; await micropip.install("패키지이름")\` 으로 설치할 수 있어요`,
            ],
        originalLine: lastLine,
      };
    }

    // ─────────────────────────────────────────────
    // ValueError
    // ─────────────────────────────────────────────
    case "ValueError": {
      if (errorMessage.includes("invalid literal for int")) {
        return {
          emoji: "🔢",
          title: "숫자로 변환할 수 없어요",
          explanation: "`int()` 에 숫자로 바꿀 수 없는 값을 넣었어요. 숫자만 들어있는 문자열이어야 해요.",
          hints: [
            `\`int("42")\` 는 되지만 \`int("안녕")\` 은 안 돼요`,
            "공백이 섞여있는지 확인하세요 — 필요하면 `.strip()` 사용",
          ],
          originalLine: lastLine,
        };
      }
      return {
        emoji: "🚫",
        title: "값이 올바른 형식이 아니에요",
        explanation: "함수에 넘긴 값의 종류는 맞지만, 값 자체가 기대하는 형식이 아니에요.",
        hints: [
          "입력한 값의 형식이 함수가 요구하는 것과 맞는지 확인하세요",
        ],
        originalLine: lastLine,
      };
    }

    default:
      return null;
  }
}
