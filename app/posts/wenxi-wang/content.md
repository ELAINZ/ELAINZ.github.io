# RFCScope
## Request for Comments (RFCs)
RFC是IETF发布的技术文档。从Internet-Draft开始，是一种公开草案，允许社区提出意见和修改，后被采纳为RFC。属于Standards Track的RFC会经历一下阶段： Proposed Standard -> Draft Stabdard -> Internet Standard
RFC一般具有统一格式，包含元数据、目录，以及固定章节。如IANA Considerations 和 Reference。内容通常使用英文说明便于理解，采用形式化表示法（如ABNF、ASN.1、SMI、YANG、CDDL）定义语法结构，提供伪代码或真实代码以展示算法，通过ASCII图和表格描述数据格式、协议流程或系统加工后。
RFC勘误：Editorial （拼写、语法、排版），Technical （内容错误）。 审核后：Reported，Verified，Held for Document Update
论文分为了logical ambiguity和logically ambiguous bug。 本文主要研究logical ambiguities bug。本文提出LLM-based framework for detecting logical ambiguities in RFCs：Inconsistency、Under-specification、other

## RFCScope框架：基于LLM的自动化系统。挑战：1. RFC篇幅长 2. 跨文档推理困难 3. 领域知识不足 4. 幻觉问题

### 自动化模块： 1. Context Constructor 2. Partitioner 3. Analyzer 4. Evaluator
1. 上下文构建器从所有文档提取关键信息
2. 分段器根据层级结构将RFC及其上下文划分为适合LLM分析的片段
3. 分析器针对每个片段检测潜在逻辑性歧义，并生成候选勘误报告
4. 评估器验证推理过程，剔除错误或幻觉结果
5. 经过人工复核后，输出最终确认的潜在勘误
   
### Context Constructor
1. 将 RFC 按段落划分；
2. 使用 RFC2HTML 工具解析引用标签与章节号；
3. 对于带明确章节号的引用，直接提取对应内容；
4. 若引用未指定章节，使用 GPT-4o 生成关键短语（keyphrase），并利用 LangChain 语义搜索 匹配最相关的段落；
5. 非 RFC 引用，调用 GPT-4o Search Preview 根据标题或 URL 搜索原文并生成摘要。

### Partitioner
若章节及上下文合计长度小于设定阈值，或层级已达限制，则将其视为独立分段；否则递归细分其子章节；每段尽可能保持完整语义与逻辑连贯性。

### Analyzer
分析器基于 OpenAI o3-mini 模型，用于检测逻辑歧义。选择该模型的原因是其具备较强推理能力、成本低于 GPT-4o，并在多项推理评测中表现更优。

检测机制：
对每个分段执行两轮推理：一次检测“不一致类”，一次检测“描述不足类”；
提示中包含所有七种子类型（I-1 至 I-3、U-1 至 U-4）的定义与示例；
模型需输出详细推理链（包括分析依据与结论过程），供后续验证使用。

### Evaluator
基于o3-mini，负责独立验证分析器生成的报告，防止幻觉输出。
对不一致类：必须存在明确，可验证的矛盾
对描述不足类：若缺失信息可在文档后续部分找到、超出协议范围或为作者有意省略， 应拒绝报告

### 人工复核
IETF Datatracker，IETF邮件存档，Github仓库，IANA注册库与相关文献。

### 未来
有效性威胁：漏检 错误类型的完整性 上下文构建局限 可复现性
LLM：更高形式化程度、更精确的定义与约束，可机器解析的结构

### 与dllm研究的相关性
都是纠错。RFC也可以作为dllm检错中的一项。

# Interactive Greybox Penetration Testing for Cloud Access Control
