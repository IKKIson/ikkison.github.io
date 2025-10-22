const n=`#

\`\`\`kt
@Tag(name = "게시글")
@SecurityRequirement(name = SwaggerAuthTypes.Bearer)
@RestController
@RequestMapping("/api/post")
class PostController(
  private val cudService: PostCudService
) {
  @Operation(
    summary = "게시글 생성",
  )
  @PostMapping
  fun create(
    @Valid @RequestBody input: PostCreateInput,
    @Parameter(hidden = true) @AuthUserId userId: Long
  ): CustomResponseEntity<Long> {
    return cudService
      .create(
        input = input,
        userId = userId
      )
      .run {
        CustomResponseEntity(data = this.id)
      }
  }
\`\`\`
`;export{n as default};
