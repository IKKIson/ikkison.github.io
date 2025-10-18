const r=`#\r
\r
\`\`\`kt\r
@Tag(name = "게시글")\r
@SecurityRequirement(name = SwaggerAuthTypes.Bearer)\r
@RestController\r
@RequestMapping("/api/post")\r
class PostController(\r
  private val cudService: PostCudService\r
) {\r
  @Operation(\r
    summary = "게시글 생성",\r
  )\r
  @PostMapping\r
  fun create(\r
    @Valid @RequestBody input: PostCreateInput,\r
    @Parameter(hidden = true) @AuthUserId userId: Long\r
  ): CustomResponseEntity<Long> {\r
    return cudService\r
      .create(\r
        input = input,\r
        userId = userId\r
      )\r
      .run {\r
        CustomResponseEntity(data = this.id)\r
      }\r
  }\r
\`\`\`\r
`;export{r as default};
